import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ManageFollowUpsProps {
  manageThread: boolean;
  setManageThread: (manageThread: boolean) => void;
}

const ManageFollowUps = ({
  manageThread,
  setManageThread,
}: ManageFollowUpsProps) => {
  return (
    <div className="flex items-center space-x-2 py-2">
      <Checkbox
        id="manage-thread"
        checked={manageThread}
        onCheckedChange={(checked) => setManageThread(checked as boolean)}
      />
      <Label htmlFor="manage-thread" className="text-sm font-normal">
        Automatically manage follow-ups
      </Label>
    </div>
  );
};

export default ManageFollowUps;
