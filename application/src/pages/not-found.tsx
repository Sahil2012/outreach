import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      globalThis.location.pathname
    );
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col items-center justify-center relative overflow-hidden p-6">
      <div className="flex flex-col items-center max-w-lg w-full text-center space-y-8">
        <div className="relative">
          <div className="text-9xl font-black tracking-tight bg-clip-text text-gray-900">
            404
          </div>
        </div>
        <div className="space-y-4 relative z-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Page not found
          </h2>
          <p className="text-lg text-muted-foreground leading-snug max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>
        <div className="pt-2 relative z-10">
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="shadow-md hover:shadow-lg transition-all min-w-40"
          >
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;