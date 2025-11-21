import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Fetch only minimal fields needed for table display
    const { data, error, count } = await supabase
      .from("job_applications")
      .select(
        "id, full_name, email, phone, yoe, current_ctc, created_at, is_deleted, job_id",
        {
          count: "exact",
        }
      )
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (err) {
    console.error("Error fetching applications:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // 1️⃣ Insert base application first
    const {
      education,
      work_experience,
      projects,
      published_papers,
      technical_skills,
      languages,
      ...baseData
    } = body;

    const { data: app, error: appError } = await supabase
      .from("job_applications")
      .insert([baseData])
      .select()
      .single();

    if (appError) throw appError;

    const application_id = app.id;

    // 2️⃣ Insert nested data if provided
    const insertNested = async (table: string, rows?: any[]) => {
      if (!rows || rows.length === 0) return;
      const withFk = rows.map((r) => ({ ...r, application_id }));
      const { error } = await supabase.from(table).insert(withFk);
      if (error) console.error(`Error inserting ${table}:`, error);
    };

    await Promise.all([
      insertNested("education", education),
      insertNested("work_experience", work_experience),
      insertNested("projects", projects),
      insertNested("published_papers", published_papers),
      insertNested("technical_skills", technical_skills),
      insertNested("languages", languages),
    ]);

    // 3️⃣ Return application with nested data
    const { data: fullApp, error: fetchError } = await supabase
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
      .eq("id", application_id)
      .single();

    if (fetchError) throw fetchError;

    return NextResponse.json({ data: fullApp }, { status: 201 });
  } catch (err) {
    console.error("Error creating application:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
