// pages/api/applications/[id]/pdf.ts
import type { NextApiRequest, NextApiResponse } from "next";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { supabase } from "@/lib/supabase";
import { createResumeDocument, ResumeDocument } from "@/lib/pdf/ResumeDocument";
import { pdfCacheService } from "@/lib/pdf/cache";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid application ID" });
    }

    // Fetch application data with all nested relations
    const { data: application, error: fetchError } = await supabase
      .from("job_applications")
      .select(`
        *,
        education:education(*),
        work_experience:work_experience(*),
        projects:projects(*),
        published_papers:published_papers(*),
        technical_skills:technical_skills(*),
        languages:languages(*)
      `)
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching application:", fetchError);
      return res.status(500).json({ error: fetchError.message });
    }

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Check cache first
    const cachedPdf = await pdfCacheService.getCachedPDF(id);
    if (cachedPdf) {
      console.log(`PDF retrieved from cache for application ${id}`);
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${application.full_name.replace(
          /[^a-z0-9]/gi,
          "_"
        )}_Resume.pdf"`
      );
      res.setHeader("Content-Length", cachedPdf.length.toString());
      
      return res.send(cachedPdf);
    }

    // Generate PDF using react-pdf
    console.log(`Generating PDF for application ${id}`);

    // Render PDF to buffer
    const pdfStream = await renderToStream(createResumeDocument(application));

    
    // Convert stream to buffer
    const chunks: any[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(Buffer.from(chunk as any));
    }
    const pdfBuffer: Buffer = Buffer.concat(chunks);

    // Validate PDF by checking the header
    const header = pdfBuffer.subarray(0, 5).toString("ascii");
    if (pdfBuffer.length < 100 || !header.includes("%PDF")) {
      throw new Error("Generated PDF is corrupt");
    }

    console.log(`Generated PDF (${pdfBuffer.length} bytes)`);

    // Cache the PDF asynchronously (don't block response)
    pdfCacheService.cachePDF(id, pdfBuffer, application.full_name).catch((err) => {
      console.error("Failed to cache PDF:", err);
    });

    // Return PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${application.full_name.replace(
        /[^a-z0-9]/gi,
        "_"
      )}_Resume.pdf"`
    );
    res.setHeader("Content-Length", pdfBuffer.length.toString());

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({
      error: "Failed to generate PDF",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}