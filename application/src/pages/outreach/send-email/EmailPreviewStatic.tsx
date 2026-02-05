import { Label } from "@/components/ui/label";

interface EmailPreviewStaticProps {
  subject: string;
  body: string;
}

export const EmailPreviewStatic = ({
  subject,
  body,
}: EmailPreviewStaticProps) => {
  return (
    <div className="bg-muted/30 p-8 rounded-3xl border overflow-y-auto">
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2 border-b pb-4">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Subject
          </Label>
          <div className="text-xl font-semibold text-foreground">{subject}</div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Message Body
          </Label>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap leading-snug text-foreground/90">
              {body}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
