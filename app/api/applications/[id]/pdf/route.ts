import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { resumeService } from "@/lib/pdf/service";

// GET /api/applications/[id]/pdf - Get PDF version of a resume
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
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
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Generate or retrieve PDF
    const { buffer, cached } = await resumeService.generatePDF(application);

    // Log cache hit/miss for monitoring
    console.log(
      `PDF ${
        cached ? "retrieved from cache" : "generated"
      } for application ${id}`
    );

    // Return PDF with proper headers for download
    // Convert Buffer to ReadableStream
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(buffer);
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${application.full_name.replace(
          /[^a-z0-9]/gi,
          "_"
        )}_Resume.pdf"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate", // Disable caching for testing
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
