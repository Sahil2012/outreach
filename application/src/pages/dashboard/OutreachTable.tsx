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
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, Building2, User, Loader2 } from 'lucide-react';
import { OutreachListItem, OutreachStatus } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';

interface OutreachTableProps {
  data: OutreachListItem[];
  isLoading: boolean;
  onToggleAutomated: (id: string, current: boolean) => void;
  onAction: (id: string, action: 'follow-up' | 'mark-absconded' | 'mark-referred') => void;
}

export const OutreachTable = ({ data, isLoading, onToggleAutomated, onAction }: OutreachTableProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: OutreachStatus) => {
    const variants: Record<string, string> = {
      'Generated': 'bg-gray-100 text-gray-700 hover:bg-gray-100',
      'Sent': 'bg-blue-100 text-blue-700 hover:bg-blue-100',
      'First Follow Up': 'bg-purple-100 text-purple-700 hover:bg-purple-100',
      'Second Follow Up': 'bg-purple-100 text-purple-700 hover:bg-purple-100',
      'Third Follow Up': 'bg-purple-100 text-purple-700 hover:bg-purple-100',
      'Absconded': 'bg-red-100 text-red-700 hover:bg-red-100',
      'Responded': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
      'Referred': 'bg-green-100 text-green-700 hover:bg-green-100',
    };
    return <Badge className={`${variants[status] || 'bg-gray-100'} border-0`}>{status}</Badge>;
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-border/40">
          <TableHead className="pl-6">Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Automated</TableHead>
          <TableHead>Last Activity</TableHead>
          <TableHead className="text-center pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
              No outreach records found.
            </TableCell>
          </TableRow>
        ) : (
          data.map((item) => (
            <TableRow
              key={item.id}
              className="group hover:bg-muted/30 border-border/40 cursor-pointer"
              onClick={() => navigate(`/outreach/view/${item.id}`)}
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
                <button
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  tabIndex={0}
                  className="cursor-default"
                >
                  <Switch
                    checked={item.isAutomated}
                    onCheckedChange={(checked: boolean) => onToggleAutomated(item.id, checked)}
                  />
                </button>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {item.lastActivity ? formatDistanceToNow(new Date(item.lastActivity), { addSuffix: true }) : '-'}
                </span>
              </TableCell>
              <TableCell className="text-center pr-6">
                <button
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  tabIndex={0}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onAction(item.id, 'follow-up')}>
                        Send Follow Up
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction(item.id, 'mark-referred')}>
                        Mark as Referred
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction(item.id, 'mark-absconded')} className="text-destructive">
                        Mark as Absconded
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
