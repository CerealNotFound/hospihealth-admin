import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { makeExcerpt } from "@/lib/utils";

// GET /api/blogs - Fetch all non-deleted blogs
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Add excerpt to each blog if not present
    const blogsWithExcerpt = data?.map((blog) => ({
      ...blog,
      excerpt: blog.excerpt || makeExcerpt(blog.content, 180),
    }));

    return NextResponse.json({ data: blogsWithExcerpt });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create new blog
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // Handle multipart form submissions (preferred)
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const title = String(form.get("title") || "").trim();
      const content = String(form.get("content") || "");
      const existingImagesRaw = String(form.get("existingImages") || "[]");
      const existingImages = JSON.parse(existingImagesRaw || "[]");

      const files = form.getAll("files") as File[];
      const alts = form.getAll("alts").map((v) => String(v));

      if (!title) {
        return NextResponse.json(
          { error: "Title is required" },
          { status: 400 }
        );
      }

      const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
      if (!baseUrl) {
        return NextResponse.json(
          { error: "Missing NEXT_PUBLIC_SUPABASE_URL" },
          { status: 500 }
        );
      }

      const uploadedKeys: string[] = [];
      const uploadedImages: { src: string; alt: string }[] = [];

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const alt = alts[i] ? String(alts[i]) : "";
          // Simple validations
          if (!(file as any).type?.startsWith?.("image/")) continue;
          if (file.size > 5 * 1024 * 1024) continue;

          const name = file.name || "upload";
          const parts = name.split(".");
          const ext = (parts.length > 1 ? parts.pop() : "bin") as string;
          const uuid =
            (globalThis.crypto as any)?.randomUUID?.() ||
            `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          const objectKey = `blogs/${uuid}.${ext}`;

          // Convert File to ArrayBuffer for Node runtime
          const buffer = await file.arrayBuffer();
          const { error: uploadError } = await supabase.storage
            .from("assets")
            .upload(objectKey, buffer, { upsert: false });

          if (uploadError) throw new Error(uploadError.message);

          uploadedKeys.push(objectKey);
          const publicUrl = `${baseUrl}/storage/v1/object/public/assets/${objectKey}`;
          uploadedImages.push({ src: publicUrl, alt });
        }

        const images = [...existingImages, ...uploadedImages];
        const excerpt = makeExcerpt(content, 180);
        const { data, error } = await supabase
          .from("blogs")
          .insert([{ title, content, images, excerpt }])

          .select()
          .single();

        if (error) throw new Error(error.message);

        return NextResponse.json({ data }, { status: 201 });
      } catch (err: any) {
        if (uploadedKeys.length > 0) {
          await supabase.storage.from("assets").remove(uploadedKeys);
        }
        return NextResponse.json(
          { error: err?.message || "Upload failed" },
          { status: 500 }
        );
      }
    }

    // Fallback JSON body (no server-side uploads)
    const body = await request.json();
    const { data, error } = await supabase
      .from("blogs")
      .insert([body])
      .select()
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
