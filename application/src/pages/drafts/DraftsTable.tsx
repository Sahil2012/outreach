import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Building2, User, Loader2, Send, Trash2 } from 'lucide-react';
import { Draft } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';

interface DraftsTableProps {
  data: Draft[];
  isLoading: boolean;
  onMarkAsSent: (id: string) => void;
  onDelete: (id: string) => void;
  isMarkingSent: boolean;
  isDeleting: boolean;
}

export const DraftsTable = ({ data, isLoading, onMarkAsSent, onDelete, isMarkingSent, isDeleting }: DraftsTableProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: Draft['status']) => {
    const variants: Record<string, string> = {
      'Generated': 'bg-green-100 text-green-700 hover:bg-green-100',
      'Generating': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
      'Sent': 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    };
    return <Badge className={`${variants[status] || 'bg-gray-100'} border-0`}>{status}</Badge>;
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  const handleRowClick = (item: Draft) => {
    if (item.status === 'Generated') {
      navigate(`/outreach/preview/${item.id}`);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-border/40">
          <TableHead className="pl-6">Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-center pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
              No drafts found.
            </TableCell>
          </TableRow>
        ) : (
          data.map((item) => (
            <TableRow
              key={item.id}
              className={`group border-border/40 ${item.status === 'Generated' ? 'hover:bg-muted/30 cursor-pointer' : 'cursor-default'}`}
              onClick={() => handleRowClick(item)}
            >
              <TableCell className="pl-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{item.employeeName}</span>
                    <span className="text-xs text-muted-foreground">{item.employeeEmail}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">{item.companyName}</span>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(item.status)}
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : '-'}
                </span>
              </TableCell>
              <TableCell className="text-center pr-6">
                <button
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  tabIndex={0}
                  className="cursor-default"
                  disabled={isMarkingSent || isDeleting}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {item.status === "Generated" && <DropdownMenuItem onClick={() => onMarkAsSent(item.id)}>
                        <Send className="mr-2 h-4 w-4" />
                        Mark as Sent
                      </DropdownMenuItem>}
                      <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
