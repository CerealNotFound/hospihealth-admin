import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import JSZip from "jszip";
import { resumeService } from "@/lib/pdf/service";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No valid application IDs provided" },
        { status: 400 }
      );
    }

    if (ids.length > 50) {
      return NextResponse.json(
        {
          error: "Too many applications selected",
          message: "Maximum 50 allowed per batch",
          limit: 50,
          selected: ids.length,
        },
        { status: 400 }
      );
    }

    const validUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const invalidIds = ids.filter((id) => !validUuid.test(id));
    if (invalidIds.length > 0) {
      return NextResponse.json(
        { error: "Invalid UUIDs", invalidIds },
        { status: 400 }
      );
    }

    // 🧩 Fetch all nested data for each application
    const { data: applications, error } = await supabase
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
      .in("id", ids);

    if (error) throw error;
    if (!applications || applications.length === 0) {
      return NextResponse.json(
        { error: "No applications found" },
        { status: 404 }
      );
    }

    // 🧠 Generate PDFs with concurrency
    const { buffers, cached, generated } = await resumeService.generateBulkPDFs(
      applications,
      5
    );

    // 📦 Create ZIP
    const zip = new JSZip();
    buffers.forEach(({ id, buffer }) => {
      const app = applications.find((a) => a.id === id);
      if (app) {
        const filename = `${app.full_name.replace(
          /[^a-z0-9]/gi,
          "_"
        )}_Resume.pdf`;
        zip.file(filename, new Uint8Array(buffer));
      }
    });

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(zipBuffer);
        controller.close();
      },
    });

    console.info(
      `Bulk export complete: ${cached} cached, ${generated} generated`
    );

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=resumes.zip",
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("Error exporting PDFs:", err);
    return NextResponse.json(
      { error: "Failed to generate PDFs" },
      { status: 500 }
    );
  }
}
