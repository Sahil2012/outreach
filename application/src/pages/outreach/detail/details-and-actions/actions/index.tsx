import { PropsWithId } from "@/lib/types/commonTypes";
import ConnectToGoogleInfo from "./ConnectToGoogleInfo";
import GenerateFollowUp from "./GenerateFollowUp";
import ManageThreadToggle from "./ManageThreadToggle";
import MarkAsAbsconded from "./MarkAsAbsconded";
import MarkAsReferred from "./MarkAsReferred";

const Actions = ({ id }: PropsWithId) => {
  return (
    <div className="space-y-6">
      <ManageThreadToggle id={id} />
      <div className="space-y-4">
        <GenerateFollowUp id={id} />
        <MarkAsReferred id={id} />
        <MarkAsAbsconded id={id} />
      </div>
      <ConnectToGoogleInfo id={id} />
    </div>
  );
};

export default Actions;
