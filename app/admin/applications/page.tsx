"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { ApplicationsTable } from "@/components/resume/ApplicationsTable";
import { PreviewDialog } from "@/components/resume/PreviewDialog";
import { useToast } from "@/hooks/use-toast";
import type { Application } from "@/types/application";
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

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewingApplicationId, setPreviewingApplicationId] = useState<
    string | null
  >(null);
  const { toast } = useToast();
  const [deletingApplicationId, setDeletingApplicationId] = useState<string | null>(null);
  const [restoringApplicationId, setRestoringApplicationId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/applications");
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      const result = await response.json();
      setApplications(result.data);
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

  return (
    <div className="min-w-0 w-full">
      <div className="flex justify-between items-start mb-6 gap-3">
        <div className="min-w-0 flex-shrink">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 truncate">
            Job Applications
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Manage job applications
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingApplication(null);
            setIsFormOpen(true);
          }}
          className="flex-shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add Application</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12 text-center">
          <p className="text-gray-500 mb-4">No applications found</p>
          <Button
            onClick={() => {
              setEditingApplication(null);
              setIsFormOpen(true);
            }}
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
            onDeleteRequest={(id) => setDeletingApplicationId(id)}
            onRestoreRequest={(id) => setRestoringApplicationId(id)}
          />
          {previewingApplicationId && (
            <PreviewDialog
              applicationId={previewingApplicationId}
              onClose={() => setPreviewingApplicationId(null)}
            />
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
              This will soft-delete the application. You can restore it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingApplicationId && handleDelete(deletingApplicationId)
              }
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
              This will restore the deleted application and make it available again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                restoringApplicationId && handleRestore(restoringApplicationId)
              }
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