import AutomatedToggle from "@/components/function/commons/AutomatedToggle";
import { PropsWithThread } from "@/lib/types/commonTypes";

const ToggleAutomated = ({ thread }: PropsWithThread) => {
  return (
    <button
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      tabIndex={0}
      className="cursor-default"
    >
      <AutomatedToggle isAutomated={thread.isAutomated} threadId={thread.id} />
    </button>
  );
};

export default ToggleAutomated;
