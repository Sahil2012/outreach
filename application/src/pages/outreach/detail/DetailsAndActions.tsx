import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { ArrowLeft, Send, UserX, MessageCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { OutreachDetail } from "@/hooks/useOutreachDetail";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import ThreadStatusBadge from "@/components/function/ThreadStatusBadge";
import AutomatedToggle from "@/components/function/AutomatedToggle";

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
  onBack,
}) => {
  return (
    <div className="space-y-8 lg:sticky lg:top-6 h-full flex flex-col pt-2">
      {/* Navigation */}
      <div className="pl-2">
        <Button
          variant="link"
          onClick={onBack}
          className="text-muted-foreground -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1 -ml-1" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-2">
        {/* Candidate Details */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold tracking-tight">
              {data.employee.name}
            </h3>
            <div className="-mt-1.5 flex items-center gap-2 text-muted-foreground/70">
              <p className="text-sm">{data.employee.email}</p>
            </div>
            {data.employee.position && (
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <p className="text-sm font-medium">{data.employee.position}</p>
                <span>•</span>
                <p className="text-sm font-medium">{data.employee.company}</p>
              </div>
            )}
            {!data.employee.position && (
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <p className="text-sm font-medium">{data.employee.company}</p>
              </div>
            )}
          </div>

          <div className="-mt-1.5 flex items-center justify-between gap-2">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-semibold">
                  Created
                </span>
                <span className="text-xs text-muted-foreground">
                  {data.createdAt
                    ? formatDistanceToNow(new Date(data.createdAt), {
                        addSuffix: true,
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-semibold">
                  Last activity
                </span>
                <span className="text-xs text-muted-foreground">
                  {data.lastUpdated
                    ? formatDistanceToNow(new Date(data.lastUpdated), {
                        addSuffix: true,
                      })
                    : "N/A"}
                </span>
              </div>
            </div>
            <ThreadStatusBadge status={data.status} />
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="automated" className="text-sm font-medium">
                Automated Follow-ups
              </Label>
              <p className="text-xs text-muted-foreground">
                AI handles follow-ups
              </p>
            </div>
            <AutomatedToggle threadId={data.threadId} />
          </div>

          <div className="space-y-4">
            {!data.isAutomated && (
              <Button
                size="lg"
                className="w-full"
                onClick={onSendFollowUp}
                disabled={isSendingFollowUp || isUpdating}
              >
                {isSendingFollowUp ? (
                  <Loader className="mr-2 text-white" />
                ) : (
                  <Send className="mr-2 w-4 h-4" />
                )}
                Generate Follow-up
              </Button>
            )}
            {!data.isAutomated && (
              <Button
                variant="outline"
                className="w-full"
                onClick={onMarkReferred}
                disabled={isUpdating}
              >
                <MessageCircle className="mr-2 w-4 h-4" />
                Mark as Referred
              </Button>
            )}
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
