import { toast } from "sonner";

const useToast = ({
  message,
  description,
  action,
}: {
  message: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}) => toast(message, { description, action });

export default useToast;
