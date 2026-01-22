import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { StatsCards } from "./StatsCards";
import { OutreachTable } from "./OutreachTable";
import { toast } from "sonner";
import { useThreads } from "@/api/threads/hooks/useThreadData";
import { ThreadsParams } from "@/api/threads/types";
import { useThreadActions } from "@/api/threads/hooks/useThreadActions";
import { useMessageActions } from "@/api/messages/hooks/useMessageActions";
import { MessageType } from "@/api/messages/types";
import { useProfileStats } from "@/api/profile/hooks/useProfileData";
import { THREAD_STATUS_VALUES } from "@/api/threads/consts";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ThreadsParams["status"]>("ALL");

  const debouncedSearch = useDebounce(searchQuery, 500);
  const pageSize = 10;

  // const {
  //   data: listData,
  //   isLoadingList,
  //   markAsSent,
  //   isMarkingAsSent,
  //   updateOutreach,
  //   refreshData,
  //   generateFollowUp,
  //   isGeneratingFollowUp,
  // } = useOutreachDashboard(page, pageSize, debouncedSearch, statusFilter);
  const {
    data: listData,
    isLoading: isLoadingList,
    refetch,
  } = useThreads({
    page,
    pageSize,
    search: debouncedSearch,
    status: statusFilter,
  });
  const { updateStatus } = useThreadActions();
  const { markAsSent, generateMessage } = useMessageActions();
  const { data: stats, isLoading: isLoadingStats } = useProfileStats();

  const handleAction = async (
    id: number,
    action: "follow-up" | "mark-absconded" | "mark-referred" | "mark-sent",
    threadId: number,
  ) => {
    try {
      if (action === "follow-up") {
        const res = await generateMessage.mutateAsync({
          type: MessageType.FOLLOW_UP,
          threadId: threadId,
        });
        navigate(`/outreach/preview/${res?.id}`, { state: res });
        toast.success("Follow-up generated successfully.");
      } else if (action === "mark-absconded") {
        await updateStatus.mutateAsync({ id, status: "CLOSED" });
        toast.success("Thread marked as absconded successfully.");
      } else if (action === "mark-referred") {
        await updateStatus.mutateAsync({ id, status: "REFERRED" });
        toast.success("Thread marked as referred successfully.");
      } else if (action === "mark-sent") {
        await markAsSent.mutateAsync({ id });
        toast.success("Draft marked as sent");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Unable to perform action. Please try again later.");
    }
  };

  const totalPages = Math.ceil((listData?.total || 0) / pageSize) || 1;
  const STATUS_OPTIONS = THREAD_STATUS_VALUES;

  return (
    <div className="space-y-8 py-8 px-4 md:px-6 lg:px-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your outreach threads and follow-ups
          </p>
        </div>
        <Button onClick={() => navigate("/outreach")}>
          <Plus className="w-4 h-4 mr-1 -ml-1" />
          New Outreach
        </Button>
      </div>

      {/* Stats Grid */}
      <StatsCards stats={stats} isLoading={isLoadingStats} />

      {/* Main Content */}
      <Card className="rounded-3xl shadow-xl border-border/40 backdrop-blur-sm bg-background/95 overflow-hidden">
        <CardHeader className="border-b border-border/40 px-6 py-6 !pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Outreach List</CardTitle>
              <CardDescription>
                Manage your ongoing conversations
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full relative"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    {statusFilter !== "ALL" && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("ALL")}>
                    All Statuses
                    {statusFilter === "ALL" && (
                      <span className="ml-auto text-primary">✓</span>
                    )}
                  </DropdownMenuItem>
                  {STATUS_OPTIONS.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => setStatusFilter(status)}
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
          <OutreachTable
            threads={listData?.threads || []}
            isLoading={isLoadingList}
            onAction={handleAction}
            isGeneratingFollowUp={generateMessage.isPending}
            page={page}
            pageSize={pageSize}
            search={searchQuery}
            status={statusFilter}
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
                  disabled={page === 1 || isLoadingList}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Button
                      key={p}
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p)}
                      disabled={isLoadingList}
                    >
                      {p}
                    </Button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isLoadingList}
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
}
