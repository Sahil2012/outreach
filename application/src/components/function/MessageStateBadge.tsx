import { Badge } from "../ui/badge";

const MessageStateBadge = ({ state }: { state: "DRAFT" | "SENT" | undefined }) => {
  if (!state) {
    return null;
  }

  if (state === "DRAFT") {
    return (
      <Badge className="bg-green-300 text-green-800 font-semibold border-0 text-[0.6rem] px-2 h-4">
        DRAFT
      </Badge>
    );
  }

  return null;
};

export default MessageStateBadge;
