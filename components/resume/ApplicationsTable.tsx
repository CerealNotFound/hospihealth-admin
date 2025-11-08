import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Loader2,
  Filter,
  ArrowDownWideNarrow,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PreviewDialog } from "./PreviewDialog";
import { ResumeActions } from "./ResumeActions";
import { ApplicationListItem } from "@/types/application";
import { RotateCcw } from "lucide-react";

interface ApplicationsTableProps {
  applications: ApplicationListItem[];
  onExport: (ids: string[]) => Promise<void>;
  onDeleteRequest?: (id: string) => void;
  onRestoreRequest?: (id: string) => void;
}

export function ApplicationsTable({
  applications,
  onExport,
  onDeleteRequest,
  onRestoreRequest,
}: ApplicationsTableProps) {
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    []
  );
  const [previewingApplicationId, setPreviewingApplicationId] = useState<
    string | null
  >(null);
  const [isExporting, setIsExporting] = useState(false);
  const [jobs, setJobs] = useState<Array<{ id: string; job_title: string }>>(
    []
  );
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [sortLatest, setSortLatest] = useState<boolean>(false);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) return;
        const result = await res.json();
        setJobs(result.data || []);
      } catch {}
    };
    loadJobs();
  }, []);

  const displayedApplications = useMemo(() => {
    let list = applications;
    if (selectedJobId) {
      list = list.filter((a: any) => a.job_id === selectedJobId);
    }
    if (sortLatest) {
      list = [...list].sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return list;
  }, [applications, selectedJobId, sortLatest]);

  const handleExport = async () => {
    if (selectedApplications.length === 0) return;

    setIsExporting(true);
    try {
      await onExport(selectedApplications);
      setSelectedApplications([]);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/applications/${id}`, { method: "DELETE" });
      setSelectedApplications((prev) => prev.filter((appId) => appId !== id));
    } catch (err) {
      // Intentionally swallow; upstream can handle refresh/toast
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await fetch(`/api/applications/${id}/restore`, { method: "POST" });
      setSelectedApplications((prev) => prev.filter((appId) => appId !== id));
    } catch (err) {
      // Intentionally swallow; upstream can handle refresh/toast
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedApplications((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map((app) => app.id));
    }
  };

  return (
    <div className="space-y-4 min-w-0">
      {applications.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Checkbox
              checked={
                selectedApplications.length === applications.length &&
                applications.length > 0
              }
              onClick={toggleAll}
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {selectedApplications.length} selected
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  <Filter className="w-4 h-4 mr-1" />
                  <span className="hidden xs:inline truncate max-w-[120px]">
                    {selectedJobId
                      ? jobs.find((j) => j.id === selectedJobId)?.job_title ||
                        "Filter"
                      : "Filter"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-w-[250px]">
                <DropdownMenuLabel>Filter by job</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedJobId(null)}>
                  All jobs
                </DropdownMenuItem>
                {jobs.map((job) => (
                  <DropdownMenuItem
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <span className="truncate">{job.job_title}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={sortLatest ? "default" : "outline"}
              size="sm"
              onClick={() => setSortLatest((s) => !s)}
              className="flex-shrink-0"
            >
              <ArrowDownWideNarrow className="w-4 h-4 mr-1" />
              <span className="hidden xs:inline whitespace-nowrap">
                {sortLatest ? "Latest" : "Original"}
              </span>
            </Button>

            {selectedApplications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isExporting}
                className="flex-shrink-0"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    <span className="hidden xs:inline">Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-1" />
                    <span className="hidden xs:inline">
                      Export ({selectedApplications.length})
                    </span>
                    <span className="xs:hidden">
                      {selectedApplications.length}
                    </span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] min-w-[200px]">Name</TableHead>
              <TableHead className="w-[220px] min-w-[220px]">Email</TableHead>
              <TableHead className="hidden sm:table-cell w-[130px] min-w-[130px]">
                Phone
              </TableHead>
              <TableHead className="hidden md:table-cell w-[100px] min-w-[100px]">
                Exp
              </TableHead>
              <TableHead className="hidden md:table-cell w-[100px] min-w-[100px]">
                CTC
              </TableHead>
              <TableHead className="hidden lg:table-cell w-[120px] min-w-[120px]">
                Applied
              </TableHead>
              <TableHead className="w-[130px] min-w-[130px] text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedApplications.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              displayedApplications.map((application) => (
                <TableRow
                  key={application.id}
                  className={application.is_deleted ? "opacity-60 bg-red-50" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-0">
                      <Checkbox
                        checked={selectedApplications.includes(application.id)}
                        onClick={() => toggleSelection(application.id)}
                        className="flex-shrink-0"
                      />
                      <span className="truncate block max-w-[140px]">
                        {application.full_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="truncate block max-w-[180px]">
                      {application.email}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {application.phone || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {application.yoe || 0}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {application.current_ctc || "N/A"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {new Date(application.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end items-center gap-1">
                      {application.is_deleted ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() =>
                            onRestoreRequest
                              ? onRestoreRequest(application.id)
                              : handleRestore(application.id)
                          }
                          title="Restore Application"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      ) : (
                        <ResumeActions
                          onPreview={() =>
                            setPreviewingApplicationId(application.id)
                          }
                          onDownload={() =>
                            window.open(
                              `/api/pdf/${application.id}/generate-pdf`,
                              "_blank"
                            )
                          }
                          onDelete={() =>
                            onDeleteRequest
                              ? onDeleteRequest(application.id)
                              : handleDelete(application.id)
                          }
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PreviewDialog
        applicationId={previewingApplicationId}
        onClose={() => setPreviewingApplicationId(null)}
      />
    </div>
  );
}