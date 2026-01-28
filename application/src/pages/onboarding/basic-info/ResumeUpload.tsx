import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Upload } from "lucide-react";

interface ResumeUploadProps {
  resume: File | null;
  onChange: (resume: File | null) => void;
}

export function ResumeUpload({ resume, onChange }: ResumeUploadProps) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(file);
  };

  const handleRemoveResume = async () => {
    if (!resume) return;
    onChange(null);
  };

  return (
    <div className="space-y-2 mb-3">
      <Label>Resume</Label>
      <div
        className={`border-2 border-dashed border-border/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-colors relative ${resume ? "" : "hover:bg-muted/30 cursor-pointer"}`}
      >
        {(() => {
          if (resume) {
            return (
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex items-center gap-3 bg-muted/30 px-4 py-3 rounded-xl w-full max-w-sm mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">
                      {resume.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(resume.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                    onClick={handleRemoveResume}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <>
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <Upload className="h-8 w-8 text-muted-foreground mb-3" />
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOC up to 10MB
                </p>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
