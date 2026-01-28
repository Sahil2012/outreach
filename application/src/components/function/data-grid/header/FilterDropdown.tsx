import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { FilterProps } from "..";

const FilterDropdown = <T extends string>({
  value,
  isFilterApplied,
  onClick,
  options,
}: FilterProps<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="icon" className="rounded-full relative">
          <Filter className="h-4 w-4" />
          {isFilterApplied && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Filter</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuItem key={option} onClick={() => onClick(option)}>
            {option}
            {value === option && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
