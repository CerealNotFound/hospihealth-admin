"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { ApplicationsTable } from "@/components/resume/ApplicationsTable";
import { PreviewDialog } from "@/components/resume/PreviewDialog";
import { useToast } from "@/hooks/use-toast";
import type { Application, ApplicationListItem } from "@/types/application";
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

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewingApplicationId, setPreviewingApplicationId] = useState<
    string | null
  >(null);
  const { toast } = useToast();
  const [deletingApplicationId, setDeletingApplicationId] = useState<
    string | null
  >(null);
  const [restoringApplicationId, setRestoringApplicationId] = useState<
    string | null
  >(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/applications?page=${page}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      const result = await response.json();
      setApplications(result.data || []);
      setPagination(result.pagination || { total: 0, totalPages: 0 });
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`/api/applications/${id}/restore`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to restore application");
      }
      setRestoringApplicationId(null);
      await fetchApplications();
    } catch (error) {
      console.error("Error restoring application:", error);
      toast({
        title: "Error",
        description: "Failed to restore application",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete application");
      }
      setDeletingApplicationId(null);
      await fetchApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive",
      });
    }
  };

  const handleBulkExport = async (ids: string[]) => {
    try {
      const response = await fetch("/api/bulk-pdf/generate-pdfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error("Failed to export PDFs");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resumes.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: `Successfully exported ${ids.length} PDFs`,
      });
    } catch (error) {
      console.error("Error exporting PDFs:", error);
      toast({
        title: "Error",
        description: "Failed to export PDFs",
        variant: "destructive",
      });
    }
  };

  const handleBulkExportCSV = async (ids: string[]) => {
    try {
      const response = await fetch("/api/applications/export-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error("Failed to export CSV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "applications.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: `Successfully exported ${ids.length} applications as CSV`,
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Error",
        description: "Failed to export CSV",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-w-0 w-full">
      <div className="flex justify-between items-start mb-6 gap-3">
        <div className="min-w-0 flex-shrink">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2e0101] truncate">
            Job Applications
          </h1>
          <p className="text-[rgba(0,0,0,0.7)] mt-1 text-sm md:text-base">
            Manage job applications
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingApplication(null);
            setIsFormOpen(true);
          }}
          className="flex-shrink-0 bg-[#DBA622] hover:bg-[#c8951f] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add Application</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-[rgba(0,0,0,0.7)]">Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-[#FCF3F3] p-8 md:p-12 text-center">
          <p className="text-[rgba(0,0,0,0.7)] mb-4">No applications found</p>
          <Button
            onClick={() => {
              setEditingApplication(null);
              setIsFormOpen(true);
            }}
            className="bg-[#DBA622] hover:bg-[#c8951f] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Application
          </Button>
        </div>
      ) : (
        <>
          <ApplicationsTable
            applications={applications}
            onExport={handleBulkExport}
            onExportCSV={handleBulkExportCSV}
            onDeleteRequest={(id) => setDeletingApplicationId(id)}
            onRestoreRequest={(id) => setRestoringApplicationId(id)}
          />
          {previewingApplicationId && (
            <PreviewDialog
              applicationId={previewingApplicationId}
              onClose={() => setPreviewingApplicationId(null)}
            />
          )}
          {pagination.totalPages > 1 && (
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
                      // Show all pages if 7 or fewer
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // Always show first page
                      pages.push(1);

                      if (page > 3) {
                        pages.push("ellipsis");
                      }

                      // Show pages around current page
                      const start = Math.max(2, page - 1);
                      const end = Math.min(totalPages - 1, page + 1);
                      for (let i = start; i <= end; i++) {
                        pages.push(i);
                      }

                      if (page < totalPages - 2) {
                        pages.push("ellipsis");
                      }

                      // Always show last page
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
        </>
      )}

      {isFormOpen && (
        <ApplicationForm
          application={editingApplication}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            fetchApplications();
            setIsFormOpen(false);
          }}
        />
      )}

      <AlertDialog
        open={!!deletingApplicationId}
        onOpenChange={(open) => !open && setDeletingApplicationId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete the application. You can restore it later if
              needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingApplicationId && handleDelete(deletingApplicationId)
              }
              className="bg-[#bb0b0b] hover:bg-[#a00a0a] text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!restoringApplicationId}
        onOpenChange={(open) => !open && setRestoringApplicationId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the deleted application and make it available
              again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                restoringApplicationId && handleRestore(restoringApplicationId)
              }
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
