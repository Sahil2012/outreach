import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RefreshProps {
  onClick: () => void;
}

const RefreshButton = ({ onClick }: RefreshProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full relative"
      onClick={() => onClick()}
    >
      <RefreshCw className="h-4 w-4" />
    </Button>
  );
};

export default RefreshButton;
