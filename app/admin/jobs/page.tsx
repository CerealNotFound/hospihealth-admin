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

interface Job {
  id: string;
  job_title: string;
  about_us: string | null;
  job_description: string | null;
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

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/jobs");
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const result = await response.json();
      setJobs(result.data);
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

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="w-full max-w-screen-xl mx-auto py-4 md:py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Jobs</h1>
          <p className="text-gray-600 mt-1">Manage job postings</p>
        </div>
        <Button
          onClick={() => {
            setEditingJob(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Job
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No jobs found</p>
          <Button
            onClick={() => {
              setEditingJob(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Job
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto pl-4">
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
                    className={job.is_deleted ? "opacity-60 bg-red-50" : ""}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {job.job_title}
                        {job.is_deleted && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
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
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingJob(job);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeletingJobId(job.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
              className="bg-green-600 hover:bg-green-700"
            >
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
