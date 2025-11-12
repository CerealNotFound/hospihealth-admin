import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

// Helper function to escape CSV values
function escapeCSV(value: any): string {
  if (value === null || value === undefined) {
    return "";
  }

  // Convert to string
  const str = String(value);

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

// Helper function to remove ID fields from nested objects
function removeIdFields(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeIdFields(item));
  }

  if (obj && typeof obj === "object") {
    const { id, application_id, ...rest } = obj;
    const cleaned: any = {};
    for (const [key, value] of Object.entries(rest)) {
      cleaned[key] = removeIdFields(value);
    }
    return cleaned;
  }

  return obj;
}

// Helper function to convert application data to CSV row
function applicationToCSVRow(app: any, origin: string): string[] {
  const row: string[] = [];

  // Top-level fields (excluding id)
  row.push(escapeCSV(app.full_name));
  row.push(escapeCSV(app.email));
  row.push(escapeCSV(app.phone));
  row.push(escapeCSV(app.address_line_1));
  row.push(escapeCSV(app.address_line_2));
  row.push(escapeCSV(app.city));
  row.push(escapeCSV(app.state));
  row.push(escapeCSV(app.pincode));
  row.push(escapeCSV(app.linkedin));
  row.push(escapeCSV(app.professional_summary));
  row.push(escapeCSV(app.yoe));
  row.push(escapeCSV(app.current_ctc));
  row.push(escapeCSV(app.domain ? JSON.stringify(app.domain) : null));
  row.push(
    escapeCSV(
      app.preferred_job_role ? JSON.stringify(app.preferred_job_role) : null
    )
  );
  row.push(
    escapeCSV(
      app.preferred_job_location
        ? JSON.stringify(app.preferred_job_location)
        : null
    )
  );
  row.push(escapeCSV(app.is_deleted));
  row.push(escapeCSV(app.created_at));
  row.push(escapeCSV(app.job_id));

  // Nested arrays as JSON strings (with ID fields removed)
  row.push(
    escapeCSV(
      app.education ? JSON.stringify(removeIdFields(app.education)) : null
    )
  );
  row.push(
    escapeCSV(
      app.work_experience
        ? JSON.stringify(removeIdFields(app.work_experience))
        : null
    )
  );
  row.push(
    escapeCSV(
      app.projects ? JSON.stringify(removeIdFields(app.projects)) : null
    )
  );
  row.push(
    escapeCSV(
      app.published_papers
        ? JSON.stringify(removeIdFields(app.published_papers))
        : null
    )
  );
  row.push(
    escapeCSV(
      app.technical_skills
        ? JSON.stringify(removeIdFields(app.technical_skills))
        : null
    )
  );
  row.push(
    escapeCSV(
      app.languages ? JSON.stringify(removeIdFields(app.languages)) : null
    )
  );

  // PDF download link with full URL (uses ID internally but not exposed as a column)
  row.push(escapeCSV(`${origin}/api/pdf/${app.id}/generate-pdf`));

  return row;
}

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

    // Fetch all nested data for each application
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

    // Get origin URL from request
    const origin = request.nextUrl.origin;

    // Define CSV headers (excluding id field)
    const headers = [
      "full_name",
      "email",
      "phone",
      "address_line_1",
      "address_line_2",
      "city",
      "state",
      "pincode",
      "linkedin",
      "professional_summary",
      "yoe",
      "current_ctc",
      "domain",
      "preferred_job_role",
      "preferred_job_location",
      "is_deleted",
      "created_at",
      "job_id",
      "education",
      "work_experience",
      "projects",
      "published_papers",
      "technical_skills",
      "languages",
      "pdf_download_link",
    ];

    // Convert applications to CSV rows
    const csvRows = [
      headers.join(","), // Header row
      ...applications.map((app) => applicationToCSVRow(app, origin).join(",")),
    ];

    // Join all rows with newlines
    const csvContent = csvRows.join("\n");

    // Convert to buffer
    const csvBuffer = Buffer.from(csvContent, "utf-8");

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(csvBuffer);
        controller.close();
      },
    });

    console.info(
      `CSV export complete: ${applications.length} applications exported`
    );

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=applications.csv",
        "Content-Length": csvBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("Error exporting CSV:", err);
    return NextResponse.json(
      { error: "Failed to generate CSV" },
      { status: 500 }
    );
  }
}
