import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useOutreachDashboard } from "@/hooks/useOutreachDashboard";
import { THREAD_STATUS_VALUES } from "@/lib/types";
import { ChevronLeft, ChevronRight, Filter, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DraftsTable } from "./DraftsTable";

const DraftsPage = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const debouncedSearch = useDebounce(searchQuery, 500);
  const pageSize = 10;

  const {
    data: listData,
    isLoadingList: isLoading,
    updateOutreach,
    isUpdating,
    deleteDraft,
    isDeletingDraft: isDeleting,
    refreshData,
  } = useOutreachDashboard(page, pageSize, debouncedSearch, statusFilter, "DRAFT");

  const drafts = listData?.threads || [];

  const totalPages = Math.ceil((listData?.total || 0) / pageSize) || 1;

  const handleDelete = async (id: number) => {
    try {
      await deleteDraft(id);
      toast.success("Draft deleted successfully");
    } catch {
      toast.error("Failed to delete draft");
    }
  };

  const handleMarkAsSent = async (id: number) => {
    try {
    //   await markAsSent(id);
      toast.success("Draft marked as sent");
    } catch {
      toast.error("Failed to mark draft as sent");
    }
  };

  return (
    <div className="space-y-8 py-8 px-4 md:px-6 lg:px-8 pb-10 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Drafts
          </h1>
          <p className="text-muted-foreground mt-1">Manage your email drafts</p>
        </div>
      </div>

      <Card className="rounded-3xl shadow-xl border-border/40 backdrop-blur-sm bg-background/95 overflow-hidden">
        <CardHeader className="border-b border-border/40 px-6 py-6 !pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Drafts List</CardTitle>
              <CardDescription>
                Review and manage your pending emails
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full relative"
                onClick={() => refreshData()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or company..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full relative"
                  >
                    <Filter className="h-4 w-4" />
                    {statusFilter !== "All" && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter("All");
                      setPage(1);
                    }}
                  >
                    All Statuses
                    {statusFilter === "All" && (
                      <span className="ml-auto text-primary">✓</span>
                    )}
                  </DropdownMenuItem>
                  {THREAD_STATUS_VALUES.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setPage(1);
                      }}
                    >
                      {status}
                      {statusFilter === status && (
                        <span className="ml-auto text-primary">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DraftsTable
            data={drafts || []}
            isLoading={isLoading}
            onDelete={handleDelete}
            onMarkAsSent={handleMarkAsSent}
            isDeleting={isDeleting}
            isMarkingSent={isUpdating}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-4 px-6 border-t border-border/40">
              <div className="text-sm font-medium">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                {totalPages <= 5 &&
                  Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Button
                        key={p}
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p)}
                        disabled={isLoading || page === p}
                        className={page === p ? "bg-secondary" : ""}
                      >
                        {p}
                      </Button>
                    )
                  )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isLoading}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DraftsPage;
