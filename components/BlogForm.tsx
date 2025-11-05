"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import QuillEditor from "@/components/ui/quill-editor";
import Quill from "quill";

interface BlogFormProps {
  blog: any;
  onClose: () => void;
  onSuccess: () => void;
}

interface ImageEntry {
  src: string;
  alt: string;
}

interface NewUploadEntry {
  file: File;
  alt: string;
}

export function BlogForm({ blog, onClose, onSuccess }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [deletedImages, setDeletedImages] = useState<ImageEntry[]>([]);
  const [newUploads, setNewUploads] = useState<NewUploadEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<number | null>(
    null
  );
  const [previewContent, setPreviewContent] = useState("");
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
      });
      setImages(Array.isArray(blog.images) ? blog.images : []);
      setPreviewContent(blog.content || "");
    } else {
      setFormData({ title: "", content: "" });
      setImages([]);
      setPreviewContent("");
    }
  }, [blog]);

  const handleExistingImageAltChange = (index: number, alt: string) => {
    const updated = [...images];
    updated[index].alt = alt;
    setImages(updated);
  };

  const handleRemoveExistingImage = (index: number) => {
    const imageToDelete = images[index];
    setDeletedImages([...deletedImages, imageToDelete]);
    setImages(images.filter((_, i) => i !== index));
    setDeleteConfirmOpen(null);
  };

  const handleNewFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next: NewUploadEntry[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      // Optional size cap ~5MB
      if (file.size > 5 * 1024 * 1024) return;
      next.push({ file, alt: "" });
    });
    if (next.length > 0) setNewUploads((prev) => [...prev, ...next]);
  };

  const handleNewUploadAltChange = (index: number, alt: string) => {
    const updated = [...newUploads];
    updated[index].alt = alt;
    setNewUploads(updated);
  };

  const handleRemoveNewUpload = (index: number) => {
    setNewUploads(newUploads.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      // Extract HTML content from Quill
      const content = quillRef.current?.root.innerHTML || "";
      form.append("content", content);
      form.append("existingImages", JSON.stringify(images));
      form.append("deletedImages", JSON.stringify(deletedImages));
      newUploads.forEach((nu) => {
        form.append("files", nu.file);
        form.append("alts", nu.alt || "");
      });

      let response: Response;
      if (blog) {
        response = await fetch(`/api/blogs/${blog.id}`, {
          method: "PUT",
          body: form,
        });
      } else {
        response = await fetch("/api/blogs", { method: "POST", body: form });
      }

      if (!response.ok) {
        throw new Error(
          blog ? "Failed to update blog" : "Failed to create blog"
        );
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting blog:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if we should show file input for new images
  const canAddNewImages = !blog || images.length === 0;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        aria-describedby="Blog form dialog"
        className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>{blog ? "Edit Blog" : "Create Blog"}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* Left side: Form */}
          <div className="flex-1 overflow-y-auto pr-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <QuillEditor
                    ref={quillRef}
                    defaultValue={blog?.content || ""}
                    onTextChange={() => {
                      if (quillRef.current) {
                        const html = quillRef.current.root.innerHTML;
                        setPreviewContent(html);
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Images</Label>
                </div>

                {/* Existing images (from DB) */}
                <div className="space-y-3">
                  {images.length > 0 &&
                    images.map((image, index) => (
                      <div
                        key={`existing-${index}`}
                        className="p-3 border border-gray-200 rounded-lg space-y-2"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <Label className="text-sm">
                              Existing Image {index + 1}
                            </Label>
                            <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                              <img
                                src={image.src}
                                alt={image.alt || `Blog image ${index + 1}`}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmOpen(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <div>
                          <Label
                            htmlFor={`existing-image-alt-${index}`}
                            className="text-xs"
                          >
                            Alt Text
                          </Label>
                          <Input
                            id={`existing-image-alt-${index}`}
                            value={image.alt}
                            onChange={(e) =>
                              handleExistingImageAltChange(
                                index,
                                e.target.value
                              )
                            }
                            placeholder="Description of the image"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    ))}
                </div>

                {/* New uploads */}
                {canAddNewImages && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleNewFilesSelected(e.target.files)}
                      />
                    </div>

                    {newUploads.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No new images selected
                      </p>
                    ) : (
                      newUploads.map((entry, index) => (
                        <div
                          key={`new-${index}`}
                          className="p-3 border border-gray-200 rounded-lg space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <Label className="text-sm">
                              New Image {index + 1}
                            </Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveNewUpload(index)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                          <div>
                            <Label className="text-xs">File</Label>
                            <Input
                              value={entry.file.name}
                              readOnly
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor={`new-image-alt-${index}`}
                              className="text-xs"
                            >
                              Alt Text
                            </Label>
                            <Input
                              id={`new-image-alt-${index}`}
                              value={entry.alt}
                              onChange={(e) =>
                                handleNewUploadAltChange(index, e.target.value)
                              }
                              placeholder="Description of the image"
                              className="text-sm"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : blog ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>

          {/* Right side: Preview */}
          <div className="flex-1 border-l border-gray-200 pl-4 overflow-y-auto">
            <div className="sticky top-0 bg-white pb-2 mb-4 border-b border-gray-200 z-10">
              <Label className="text-lg font-semibold">Preview</Label>
            </div>
            <div
              className="blog-preview"
              style={{
                lineHeight: "1.6",
                fontSize: "14px",
              }}
              dangerouslySetInnerHTML={{ __html: previewContent }}
            />
          </div>
        </div>

        {/* Image Delete Confirmation Dialog */}
        <AlertDialog
          open={deleteConfirmOpen !== null}
          onOpenChange={() => setDeleteConfirmOpen(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Image?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the image. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteConfirmOpen !== null) {
                    handleRemoveExistingImage(deleteConfirmOpen);
                  }
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
