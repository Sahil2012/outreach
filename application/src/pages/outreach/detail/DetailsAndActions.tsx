import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { ArrowLeft, Send, UserX, MessageCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { OutreachDetail } from "@/hooks/useOutreachDetail";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface DetailsAndActionsProps {
  data: OutreachDetail;
  isSendingFollowUp: boolean;
  isUpdating: boolean;
  onSendFollowUp: () => void;
  onMarkAbsconded: () => void;
  onMarkReferred: () => void;
  onToggleAutomated: (checked: boolean) => void;
  onBack: () => void;
}

export const DetailsAndActions: React.FC<DetailsAndActionsProps> = ({
  data,
  isSendingFollowUp,
  isUpdating,
  onSendFollowUp,
  onMarkAbsconded,
  onMarkReferred,
  onToggleAutomated,
  onBack,
}) => {
  const getStatusBadge = (status: string) => {
    // Simplified mapping for brevity, assume similar to table
    const variants: Record<string, string> = {
      'Generated': 'bg-gray-100 text-gray-700',
      'Sent': 'bg-blue-100 text-blue-700',
      'Responded': 'bg-yellow-100 text-yellow-700',
      'Referred': 'bg-green-100 text-green-700',
      'Absconded': 'bg-red-100 text-red-700'
    };
    return <Badge className={`${variants[status] || 'bg-gray-100'} border-0`}>{status}</Badge>;
  };

  return (

    <div className="space-y-8 lg:sticky lg:top-6 h-full flex flex-col pt-2">
      {/* Navigation */}
      <div>
        <Button variant="link" onClick={onBack} className="text-muted-foreground -ml-4">
          <ArrowLeft className="w-4 h-4 mr-1 -ml-1" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        {/* Candidate Details */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold tracking-tight">{data.employeeName}</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <p className="text-sm">{data.employeeEmail}</p>
              <span>•</span>
              <p className="text-sm">{data.companyName}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-semibold">Last activity</span>
              <span className="text-xs text-muted-foreground">
                {data.lastActivity ? formatDistanceToNow(new Date(data.lastActivity), { addSuffix: true }) : 'N/A'}
              </span>
            </div>
            {getStatusBadge(data.status)}
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="automated" className="text-sm font-medium">Automated Follow-ups</Label>
              <p className="text-xs text-muted-foreground">AI handles follow-ups</p>
            </div>
            <Switch
              id="automated"
              checked={data.isAutomated}
              onCheckedChange={onToggleAutomated}
              disabled={isUpdating}
            />
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full"
              onClick={onSendFollowUp}
              disabled={isSendingFollowUp || isUpdating}
            >
              {isSendingFollowUp ? <Loader className="mr-2 text-white" /> : <Send className="mr-2 w-4 h-4" />}
              Send Follow-up Now
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={onMarkReferred}
              disabled={isUpdating}
            >
              <MessageCircle className="mr-2 w-4 h-4" />
              Mark as Referred
            </Button>
            <Button
              variant="outline"
              className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
              onClick={onMarkAbsconded}
              disabled={isUpdating}
            >
              <UserX className="mr-2 w-4 h-4" />
              Mark as Absconded
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
