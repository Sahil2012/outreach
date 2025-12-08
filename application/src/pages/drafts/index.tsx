import { useState, useMemo } from 'react';
import { DraftsTable } from "./DraftsTable";
import { useDrafts } from "@/hooks/useDrafts";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Draft } from "@/lib/types";

const DraftsPage = () => {
    const { drafts, isLoading, deleteDraft, markAsSent, isDeleting, isMarkingSent } = useDrafts();
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    
    const debouncedSearch = useDebounce(searchQuery, 500);
    const limit = 10;

    const filteredDrafts = useMemo(() => {
        if (!drafts) return [];
        return drafts.filter((draft) => {
            const matchesSearch = 
                draft.employeeName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                draft.companyName.toLowerCase().includes(debouncedSearch.toLowerCase());
            
            const matchesStatus = statusFilter === 'All' || draft.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [drafts, debouncedSearch, statusFilter]);

    const paginatedDrafts = useMemo(() => {
        const startIndex = (page - 1) * limit;
        return filteredDrafts.slice(startIndex, startIndex + limit);
    }, [filteredDrafts, page]);

    const totalPages = Math.ceil(filteredDrafts.length / limit) || 1;

    const handleDelete = async (id: string) => {
        try {
            await deleteDraft(id);
            toast.success("Draft deleted successfully");
        } catch {
            toast.error("Failed to delete draft");
        }
    };

    const handleMarkAsSent = async (id: string) => {
        try {
            await markAsSent(id);
            toast.success("Draft marked as sent");
        } catch {
            toast.error("Failed to mark draft as sent");
        }
    };

    const STATUS_OPTIONS: Draft['status'][] = ['Generated', 'Generating', 'Sent'];

    return (
        <div className="space-y-8 py-8 px-4 md:px-6 lg:px-8 pb-10 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Drafts</h1>
                    <p className="text-muted-foreground mt-1">Manage your email drafts</p>
                </div>
            </div>

            <Card className="rounded-3xl shadow-xl border-border/40 backdrop-blur-sm bg-background/95 overflow-hidden">
                <CardHeader className="border-b border-border/40 px-6 py-6 !pb-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Drafts List</CardTitle>
                            <CardDescription>Review and manage your pending emails</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by name or company..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                    className="pl-10 w-64"
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button variant="outline" size="icon" className="rounded-full relative">
                                        <Filter className="h-4 w-4" />
                                        {statusFilter !== 'All' && (
                                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => { setStatusFilter('All'); setPage(1); }}>
                                        All Statuses
                                        {statusFilter === 'All' && <span className="ml-auto text-primary">✓</span>}
                                    </DropdownMenuItem>
                                    {STATUS_OPTIONS.map((status) => (
                                        <DropdownMenuItem key={status} onClick={() => { setStatusFilter(status); setPage(1); }}>
                                            {status}
                                            {statusFilter === status && <span className="ml-auto text-primary">✓</span>}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <DraftsTable
                        data={paginatedDrafts}
                        isLoading={isLoading}
                        onDelete={handleDelete}
                        onMarkAsSent={handleMarkAsSent}
                        isDeleting={isDeleting}
                        isMarkingSent={isMarkingSent}
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
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1 || isLoading}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                {totalPages <= 5 && Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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
