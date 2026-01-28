import { Card, CardContent } from "@/components/ui/card";
import TableHeader from "./header";
import Pagination from "./Pagination";
import { Dispatch, ReactNode, SetStateAction } from "react";

export interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>>;
  disabled: boolean;
}

export interface FilterProps<T> {
  options: readonly T[];
  value: T;
  onClick: (value: T) => void;
  isFilterApplied: boolean;
}

export interface SearchProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

interface DataGridProps<T> {
  header: string;
  description: string;
  filter?: FilterProps<T>;
  search?: SearchProps;
  refresh?: () => void;
  pagination?: PaginationProps;
  children: ReactNode;
}

const DataGrid = <T extends string>({
  header,
  description,
  filter,
  refresh,
  search,
  pagination,
  children,
}: DataGridProps<T>) => {
  return (
    <Card className="rounded-3xl shadow-xl border-border/40 backdrop-blur-sm bg-background/95 overflow-hidden">
      <TableHeader<T>
        header={header}
        description={description}
        filter={filter}
        refresh={refresh}
        search={search}
      />
      <CardContent className="p-0">
        {children}
        {pagination && <Pagination {...pagination} />}
      </CardContent>
    </Card>
  );
};

export default DataGrid;
