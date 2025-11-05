"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import QuillEditor from "@/components/ui/quill-editor";
import Quill from "quill";

interface JobFormProps {
  job: any;
  onClose: () => void;
  onSuccess: () => void;
}

const HARDCODED_ABOUT_US =
  "We at Hospihealth Consultants India Pvt. Ltd., India's leading hospital and healthcare consultancy based in Mumbai, are expanding our team. We specialize in strategic consulting for hospitals, clinics, healthcare startups, and public health organizations. From hospital planning and operations management to branding, digital transformation, and patient engagement—we empower healthcare providers to thrive.";

const SIMPLIFIED_TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
];

export function JobForm({ job, onClose, onSuccess }: JobFormProps) {
  const [formData, setFormData] = useState({
    job_title: "",
    job_description: "",
    openings: 0,
    experience_required: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const jobDetailsRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (job) {
      setFormData({
        job_title: job.job_title || "",
        job_description: job.job_description || "",
        openings: job.openings || 0,
        experience_required: job.experience_required?.join(", ") || "",
        tags: job.tags?.join(", ") || "",
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Extract HTML content from Quill editor
    const jobDetailsHtml = jobDetailsRef.current?.root.innerHTML || "";

    const dataToSubmit = {
      ...formData,
      about_us: HARDCODED_ABOUT_US,
      experience_required: formData.experience_required
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      tags: formData.tags
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      job_details: jobDetailsHtml,
      openings: Number(formData.openings),
    };

    try {
      if (job) {
        const response = await fetch(`/api/jobs/${job.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        });

        if (!response.ok) {
          throw new Error("Failed to update job");
        }
      } else {
        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        });

        if (!response.ok) {
          throw new Error("Failed to create job");
        }
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting job:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        aria-describedby="Job form dialog"
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>{job ? "Edit Job" : "Create Job"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="job_title">Job Title *</Label>
            <Input
              id="job_title"
              value={formData.job_title}
              onChange={(e) =>
                setFormData({ ...formData, job_title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="job_description">Job Description</Label>
            <Textarea
              id="job_description"
              value={formData.job_description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  job_description: e.target.value,
                })
              }
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="openings">Openings</Label>
            <Input
              id="openings"
              type="number"
              value={formData.openings}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  openings: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="experience_required">
              Experience Required (comma-separated)
            </Label>
            <Input
              id="experience_required"
              value={formData.experience_required}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experience_required: e.target.value,
                })
              }
              placeholder="e.g., 2-3 years, 3-5 years"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tags: e.target.value,
                })
              }
              placeholder="e.g., healthcare, consulting, architecture"
            />
          </div>

          <div>
            <Label htmlFor="job_details">Job Details</Label>
            <div className="border border-gray-200 rounded-lg">
              <QuillEditor
                ref={jobDetailsRef}
                defaultValue={job?.job_details || ""}
                toolbar={SIMPLIFIED_TOOLBAR}
              />
            </div>
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
              {isSubmitting ? "Saving..." : job ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
