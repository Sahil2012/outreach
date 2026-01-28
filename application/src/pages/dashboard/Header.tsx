import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default Header;
