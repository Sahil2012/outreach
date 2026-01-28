import AutomatedToggle from "@/components/function/AutomatedToggle";
import { PropsWithThread } from "../types";

const ToggleAutomated = ({ thread }: PropsWithThread) => {
  return (
    <button
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      tabIndex={0}
      className="cursor-default"
    >
      <AutomatedToggle data={thread} threadId={thread.id} />
    </button>
  );
};

export default ToggleAutomated;
