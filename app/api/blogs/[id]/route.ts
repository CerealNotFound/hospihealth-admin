import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { makeExcerpt } from "@/lib/utils";

// GET /api/blogs/[id] - Fetch complete blog record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Ensure excerpt exists
    const blogWithExcerpt = {
      ...data,
      excerpt: data.excerpt || makeExcerpt(data.content || "", 180),
    };

    return NextResponse.json({ data: blogWithExcerpt });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE image from storage bucket
async function deleteImageFromStorage(imageUrl: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!baseUrl) return false;

    // Extract the object key from the URL
    const objectKey = imageUrl.replace(
      `${baseUrl}/storage/v1/object/public/assets/`,
      ""
    );
    if (!objectKey.startsWith("blogs/")) return false;

    const { error } = await supabase.storage.from("assets").remove([objectKey]);

    return !error;
  } catch (err) {
    console.error("Error deleting image:", err);
    return false;
  }
}

// PUT /api/blogs/[id] - Update existing blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const title = String(form.get("title") || "").trim();
      const content = String(form.get("content") || "");
      const existingImagesRaw = String(form.get("existingImages") || "[]");
      const existingImages = JSON.parse(existingImagesRaw || "[]");
      const deletedImagesRaw = String(form.get("deletedImages") || "[]");
      const deletedImages = JSON.parse(deletedImagesRaw || "[]");

      // Delete removed images from storage
      if (deletedImages.length > 0) {
        await Promise.all(
          deletedImages.map(async (img: { src: string }) => {
            await deleteImageFromStorage(img.src);
          })
        );
      }

      const files = form.getAll("files") as File[];
      const alts = form.getAll("alts").map((v) => String(v));

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
          if (!(file as any).type?.startsWith?.("image/")) continue;
          if (file.size > 5 * 1024 * 1024) continue;

          const name = file.name || "upload";
          const parts = name.split(".");
          const ext = (parts.length > 1 ? parts.pop() : "bin") as string;
          const uuid =
            (globalThis.crypto as any)?.randomUUID?.() ||
            `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          const objectKey = `blogs/${uuid}.${ext}`;

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
        const payload: any = { title, content, images, excerpt };
        if (!title) delete payload.title; // allow partial when editing

        const { data, error } = await supabase
          .from("blogs")
          .update(payload)
          .eq("id", id)
          .select()
          .single();
        if (error) throw new Error(error.message);
        return NextResponse.json({ data });
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

    // Fallback JSON update
    const body = await request.json();
    const { data, error } = await supabase
      .from("blogs")
      .update(body)
      .eq("id", id)
      .select()
      .single();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id] - Soft delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("blogs")
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
