import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/ui/loader';
import { Upload, Trash2 } from 'lucide-react';
import { useResume } from '@/hooks/useResume';
import { useEffect, useState } from 'react';

interface ResumeUploadProps {
  onUpload: (file: File) => void;
  onRemove: () => void;
  initialResume?: File | null;
}

export function ResumeUpload({ onUpload, onRemove, initialResume }: Readonly<ResumeUploadProps>) {
  const { uploadResume, deleteResume, isLoading: isResumeProcessing } = useResume();
  const [resume, setResume] = useState<File | null>(initialResume || null);
  const [displayError, setDisplayError] = useState<string | null>(null);

  useEffect(() => {
    if (initialResume) {
      setResume(initialResume);
    }
  }, [initialResume]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDisplayError(null);

    try {
      await uploadResume(file);
      setResume(file);
      onUpload(file);
    } catch (error) {
      console.error("Failed to upload resume", error);
      setDisplayError("Failed to process resume. Please try again.");
    }
  };

  const handleRemoveResume = async () => {
    if (!resume) return;

    setDisplayError(null);

    try {
      await deleteResume();
      setResume(null);
      onRemove();
    } catch (error) {
      console.error("Failed to delete resume", error);
      setDisplayError("Failed to delete resume. Please try again.");
    }
  };

  return (
    <div className="space-y-2">
      <Label>Resume</Label>
      <div className={`border-2 border-dashed ${displayError ? 'border-destructive/50' : 'border-border/60'} rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-colors relative ${!resume && !isResumeProcessing ? 'hover:bg-muted/30 cursor-pointer' : ''}`}>

        {(() => {
          if (isResumeProcessing) {
            return (
              <div className="flex flex-col items-center justify-center py-2">
                <Loader className="h-8 w-8 mb-3 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Uploading...</p>
              </div>
            );
          }

          if (resume) {
            return (
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex items-center gap-3 bg-muted/30 px-4 py-3 rounded-xl w-full max-w-sm mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">{resume.name}</p>
                    <p className="text-xs text-muted-foreground">{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
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
                <p className="text-xs text-muted-foreground">Upload complete</p>
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
                disabled={isResumeProcessing}
              />
              <Upload className="h-8 w-8 text-muted-foreground mb-3" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF, DOC up to 10MB</p>
              </div>
            </>
          );
        })()}

        {displayError && (
          <p className="text-xs text-destructive mt-3 font-medium">{displayError}</p>
        )}
      </div>
    </div>
  );
}
