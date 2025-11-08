// pages/api/applications/bulk-pdf.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import JSZip from "jszip";
import { generateBulkPDFs } from "@/lib/pdf/bulk-pdf";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { ids } = req.body;

    // Input validation
    if (!Array.isArray(ids)) {
      return res.status(400).json({
        error: "Invalid request: application IDs must be an array",
      });
    }

    if (ids.length === 0) {
      return res.status(400).json({ error: "No application IDs provided" });
    }

    if (ids.length > 50) {
      return res.status(400).json({
        error: "Too many applications selected",
        message: "Maximum 50 applications allowed per batch",
        limit: 50,
        selected: ids.length,
      });
    }

    // Validate UUIDs
    const validUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const invalidIds = ids.filter((id: string) => !validUuid.test(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        error: "Invalid application IDs",
        message: "One or more application IDs are invalid",
        invalidIds,
      });
    }

    // Fetch all applications in one query with all nested relations
    const { data: applications, error: fetchError } = await supabase
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
      .in("id", ids);

    if (fetchError) {
      console.error("Error fetching applications:", fetchError);
      return res.status(500).json({ error: fetchError.message });
    }

    if (!applications || applications.length === 0) {
      return res.status(404).json({ error: "No applications found" });
    }

    console.log(`Bulk generating PDFs for ${applications.length} applications`);

    // Generate PDFs with controlled concurrency
    const { buffers, cached, generated } = await generateBulkPDFs(
      applications,
      5 // Concurrency limit
    );

    // Create ZIP file
    const zip = new JSZip();

    // Add each PDF to the ZIP
    buffers.forEach(({ id, buffer }: { id: string; buffer: Buffer }) => {
      const application = applications.find((app) => app.id === id);
      if (application) {
        const filename = `${application.full_name.replace(
          /[^a-z0-9]/gi,
          "_"
        )}_Resume.pdf`;
        zip.file(filename, new Uint8Array(buffer));
      }
    });

    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6,
      },
    });

    console.log(
      `Bulk export completed: ${cached} cached, ${generated} generated, ${zipBuffer.length} bytes`
    );

    // Return ZIP file
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=resumes.zip");
    res.setHeader("Content-Length", zipBuffer.length.toString());

    return res.send(zipBuffer);
  } catch (error) {
    console.error("Error in bulk PDF generation:", error);
    return res.status(500).json({
      error: "Failed to generate PDFs",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
