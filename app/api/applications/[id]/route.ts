import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

// GET /api/applications/[id] - Fetch complete application with all nested relations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data, error } = await supabase
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

    if (!data) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Restructure data to ensure nested arrays exist cleanly
    const formatted = {
      ...data,
      education: data.education || [],
      work_experience: data.work_experience || [],
      projects: data.projects || [],
      published_papers: data.published_papers || [],
      technical_skills: data.technical_skills || [],
      languages: data.languages || [],
    };

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/applications/[id] - Update existing application
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id } = await params;

    const { data, error } = await supabase
      .from("job_applications")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/applications/[id] - Soft delete application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from("job_applications")
      .update({ is_deleted: true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
