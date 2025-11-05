import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { resumeService } from "@/lib/pdf/service";
import JSZip from "jszip";

export async function POST(request: NextRequest) {
  try {
    // Get list of application IDs from request body
    const { ids } = await request.json();

    // Input validation
    if (!Array.isArray(ids)) {
      return NextResponse.json(
        { error: "Invalid request: application IDs must be an array" },
        { status: 400 }
      );
    }

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "No application IDs provided" },
        { status: 400 }
      );
    }

    if (ids.length > 50) {
      return NextResponse.json(
        {
          error: "Too many applications selected",
          message: "Maximum 50 applications allowed per batch",
          limit: 50,
          selected: ids.length,
        },
        { status: 400 }
      );
    }

    // Validate UUIDs
    const validUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const invalidIds = ids.filter((id) => !validUuid.test(id));
    if (invalidIds.length > 0) {
      return NextResponse.json(
        {
          error: "Invalid application IDs",
          message: "One or more application IDs are invalid",
          invalidIds,
        },
        { status: 400 }
      );
    }

    // Fetch all applications in one query
    const { data: applications, error } = await supabase
      .from("job_applications")
      .select("*")
      .in("id", ids);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!applications || applications.length === 0) {
      return NextResponse.json(
        { error: "No applications found" },
        { status: 404 }
      );
    }

    // Generate PDFs with controlled concurrency
    const { buffers, cached, generated } = await resumeService.generateBulkPDFs(
      applications,
      5 // Concurrency limit
    );

    // Create ZIP file
    const zip = new JSZip();

    // Add each PDF to the ZIP
    buffers.forEach(({ id, buffer }) => {
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
        level: 6, // Balanced compression level
      },
    });

    // Convert Buffer to ReadableStream
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(zipBuffer);
        controller.close();
      },
    });

    // Log stats
    console.info(
      `Bulk export completed: ${cached} cached, ${generated} generated`
    );

    // Return ZIP file
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=resumes.zip",
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error in bulk PDF generation:", error);
    return NextResponse.json(
      { error: "Failed to generate PDFs" },
      { status: 500 }
    );
  }
}
