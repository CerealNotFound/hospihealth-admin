"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { JobForm } from "@/components/JobForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, RotateCcw } from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Job {
  id: string;
  job_title: string;
  about_us: string | null;
  job_description: string | null;
  job_details?: string | null;
  openings: number | null;
  experience_required: string[] | null;
  tags: string[] | null;
  key_responsibilities: string | null;
  qualification: string | null;
  is_deleted: boolean;
  created_at: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [restoringJobId, setRestoringJobId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/jobs?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const result = await response.json();
      setJobs(result.data || []);
      setPagination(result.pagination || { total: 0, totalPages: 0 });
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
    setIsLoading(false);
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}/restore`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to restore job");
      }

      setRestoringJobId(null);
      fetchJobs();
    } catch (error) {
      console.error("Error restoring job:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setDeletingJobId(null);
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleEdit = async (job: Job) => {
    setIsLoadingJob(true);
    try {
      const response = await fetch(`/api/jobs/${job.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch job details");
      }
      const result = await response.json();
      setEditingJob(result.data);
      setIsFormOpen(true);
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setIsLoadingJob(false);
    }
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto py-4 md:py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2e0101]">
            Jobs
          </h1>
          <p className="text-[rgba(0,0,0,0.7)] mt-1">Manage job postings</p>
        </div>
        <Button
          onClick={() => {
            setEditingJob(null);
            setIsFormOpen(true);
          }}
          disabled={isLoadingJob}
          className="bg-[#DBA622] hover:bg-[#c8951f] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Job
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-[rgba(0,0,0,0.7)]">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-[#FCF3F3] p-12 text-center">
          <p className="text-[rgba(0,0,0,0.7)] mb-4">No jobs found</p>
          <Button
            onClick={() => {
              setEditingJob(null);
              setIsFormOpen(true);
            }}
            disabled={isLoadingJob}
            className="bg-[#DBA622] hover:bg-[#c8951f] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Job
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-[#FCF3F3] overflow-auto pl-4">
          <div className="-mx-4 md:mx-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Openings
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Experience Required
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Created
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow
                    key={job.id}
                    className={job.is_deleted ? "opacity-60 bg-[#FCF3F3]" : ""}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {job.job_title}
                        {job.is_deleted && (
                          <span className="text-xs bg-[#FCF3F3] text-[#bb0b0b] px-2 py-1 rounded">
                            Deleted
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {job.openings || 0}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {job.experience_required &&
                      job.experience_required.length > 0
                        ? job.experience_required.join(", ")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {new Date(job.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {job.is_deleted ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRestoringJobId(job.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(job)}
                            disabled={isLoadingJob}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeletingJobId(job.id)}
                            className="bg-[#bb0b0b] hover:bg-[#a00a0a] text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {!isLoading && jobs.length > 0 && pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {(() => {
                const pages: (number | "ellipsis")[] = [];
                const totalPages = pagination.totalPages;

                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  pages.push(1);
                  if (page > 3) {
                    pages.push("ellipsis");
                  }
                  const start = Math.max(2, page - 1);
                  const end = Math.min(totalPages - 1, page + 1);
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  if (page < totalPages - 2) {
                    pages.push("ellipsis");
                  }
                  pages.push(totalPages);
                }

                return pages.map((item, idx) => {
                  if (item === "ellipsis") {
                    return (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return (
                    <PaginationItem key={item}>
                      <PaginationLink
                        onClick={() => setPage(item)}
                        isActive={item === page}
                        className="cursor-pointer"
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  );
                });
              })()}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    page < pagination.totalPages && setPage(page + 1)
                  }
                  className={
                    page === pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {isFormOpen && (
        <JobForm
          job={editingJob}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            fetchJobs();
            setIsFormOpen(false);
          }}
        />
      )}

      <AlertDialog
        open={!!deletingJobId}
        onOpenChange={(open) => !open && setDeletingJobId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete the job. You can restore it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingJobId && handleDelete(deletingJobId)}
              className="bg-[#bb0b0b] hover:bg-[#a00a0a] text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!restoringJobId}
        onOpenChange={(open) => !open && setRestoringJobId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Job?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the deleted job and make it available again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => restoringJobId && handleRestore(restoringJobId)}
              className="bg-[#DBA622] hover:bg-[#c8951f] text-white"
            >
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
