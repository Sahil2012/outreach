import { ThreadsMeta } from "@/api/threads/types";
import CompanyDetails from "@/components/function/data-grid/cells/CompanyDetails";
import EmployeeDetails from "@/components/function/data-grid/cells/EmployeeDetails";
import LastUpdated from "@/components/function/data-grid/cells/LastUpdated";
import ThreadActions from "@/components/function/data-grid/cells/ThreadActions";
import ThreadStatusBadge from "@/components/function/status-badges/ThreadStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";

interface DraftsTableProps {
  threads: ThreadsMeta["threads"];
  isLoading: boolean;
}

export const DraftsTable = ({ threads, isLoading }: DraftsTableProps) => {
  const navigate = useNavigate();

  const tableCells = [
    {
      Comp: EmployeeDetails,
    },
    {
      Comp: CompanyDetails,
    },
    {
      Comp: ThreadStatusBadge,
    },
    {
      Comp: LastUpdated,
    },
    {
      Comp: ThreadActions,
      className: "text-center pr-6",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-border/40">
          <TableHead className="pl-6">Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-center pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {threads.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="h-24 text-center text-muted-foreground"
            >
              No drafts found.
            </TableCell>
          </TableRow>
        ) : (
          threads.map((thread) => (
            <TableRow
              key={thread.id}
              className="group border-border/40 hover:bg-muted/30 cursor-pointer"
              onClick={() =>
                navigate(`/outreach/preview/${thread.messages[0].id}`)
              }
            >
              {tableCells.map((cell) => (
                <TableCell className={cn(cell.className)}>
                  <cell.Comp thread={thread} />
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
