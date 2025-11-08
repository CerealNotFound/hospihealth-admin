import React from "react";
import ReactPDF from "@react-pdf/renderer";
import { supabase } from "../supabase";
import { LRUCache } from "lru-cache";
import { ResumeDocument } from "./ResumeDocument";

// Cache for tracking PDF generation status
const pdfCache = new LRUCache<string, boolean>({
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 60 * 24, // 24 hour TTL
});

export class PDFGenerator {
  constructor() {}

  public async generatePDF(
    applicationId: string,
    options: {
      outputPath: string;
      cacheKey: string;
    }
  ): Promise<Buffer> {
    try {
      console.log("=== PDF GENERATION DEBUG ===");
      console.log("Application ID:", applicationId);

      // Fetch application data from Supabase with all nested relations
      const { data: application, error } = await supabase
        .from("job_applications")
        .select(
          `
          *,
          education:education(*),
          work_experience:work_experience(*),
          projects:projects(*),
          published_papers:published_papers(*),
          technical_skills:technical_skills(*),
          languages:languages(*)
        `
        )
        .eq("id", applicationId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch application data: ${error.message}`);
      }

      if (!application) {
        throw new Error("Application not found");
      }

      console.log("Application data fetched:", !!application);
      console.log("Full name:", application.full_name);

      // Generate PDF using react-pdf
      console.log("Generating PDF with react-pdf...");
      console.log("Application data:", JSON.stringify(application, null, 2));

      // Render to stream
      const { renderToStream, render } = ReactPDF;

      // Use the component as JSX - ensure React is imported properly
      const DocumentComponent = ResumeDocument;
      const stream = await render(
        <DocumentComponent data={application} />,
        "/tmp/test.pdf"
      );

      // Convert stream to buffer
      const chunks: any[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      // @ts-ignore - Buffer.concat types mismatch
      const pdfBuffer = Buffer.concat(chunks);

      console.log(`Generated PDF (${pdfBuffer.length} bytes)`);
      console.log("=== END PDF GENERATION DEBUG ===");

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("assets")
        .upload(options.outputPath, pdfBuffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Failed to upload PDF: ${uploadError.message}`);
      }

      // Update cache
      pdfCache.set(options.cacheKey, true);

      return pdfBuffer;
    } catch (error) {
      console.error("PDF generation failed:", error);
      throw error;
    }
  }

  public async generateMultiplePDFs(
    jobs: Array<{
      applicationId: string;
      outputPath: string;
      cacheKey: string;
    }>,
    concurrency: number = 5
  ): Promise<Array<{ outputPath: string; buffer: Buffer }>> {
    const results: Array<{ outputPath: string; buffer: Buffer }> = [];
    const chunks = [];

    // Split jobs into chunks based on concurrency
    for (let i = 0; i < jobs.length; i += concurrency) {
      chunks.push(jobs.slice(i, i + concurrency));
    }

    // Process chunks sequentially, but jobs within chunk concurrently
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(async (job) => {
          const buffer = await this.generatePDF(job.applicationId, {
            outputPath: job.outputPath,
            cacheKey: job.cacheKey,
          });
          return { outputPath: job.outputPath, buffer };
        })
      );
      results.push(...chunkResults);
    }

    return results;
  }

  public static async checkPDFExists(cacheKey: string): Promise<boolean> {
    // Check memory cache first
    if (pdfCache.has(cacheKey)) {
      return true;
    }

    // Check Supabase storage by actually trying to list the file
    try {
      const { data, error } = await supabase.storage
        .from("assets")
        .list("job-applications", {
          search: `${cacheKey}.pdf`,
        });

      if (error) {
        console.error("Error checking PDF existence:", error);
        return false;
      }

      const fileExists =
        data && data.length > 0 && data[0].name === `${cacheKey}.pdf`;

      if (fileExists) {
        // Update memory cache
        pdfCache.set(cacheKey, true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking PDF existence:", error);
      return false;
    }
  }

  public static async getPDFUrl(cacheKey: string): Promise<string | null> {
    try {
      const { data } = await supabase.storage
        .from("assets")
        .getPublicUrl(`job-applications/${cacheKey}.pdf`);

      return data?.publicUrl || null;
    } catch (error) {
      console.error("Error getting PDF URL:", error);
      return null;
    }
  }
}
