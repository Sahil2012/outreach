import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SearchProps } from "..";

const SearchBar = ({ placeholder, value, onChange }: SearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 w-64"
      />
    </div>
  );
};

export default SearchBar;
