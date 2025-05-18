import { cn } from "@/lib/utils";
import type { Status as StatusType } from "@/types";

const Status = ({
  status,
  isLate,
}: {
  status: StatusType;
  isLate: boolean;
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "scheduled":
        return "bg-blue-300";
      case "arrived":
        return "bg-green-300";
      case "departed":
        return "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };
  return (
    <div
      className={cn(
        "px-2 py-1 rounded-md text-xs font-medium",
        getStatusColor(),
        isLate ? "text-red-500" : ""
      )}
    >
      {status}
    </div>
  );
};

export default Status;
