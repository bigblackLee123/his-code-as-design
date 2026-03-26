import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export interface FinishActionBarProps {
  label: string;
  variant?: "primary" | "success";
  onFinish: () => void;
  disabled?: boolean;
  className?: string;
}

export function FinishActionBar({
  label,
  variant = "primary",
  onFinish,
  disabled = false,
  className,
}: FinishActionBarProps) {
  const colorClass =
    variant === "success"
      ? "bg-success-600 hover:bg-success-700 text-white"
      : "bg-primary-800 hover:bg-primary-900 text-white";

  return (
    <Button
      size="lg"
      onClick={onFinish}
      disabled={disabled}
      className={`w-full rounded-xl text-base font-bold py-6 ${colorClass} ${className ?? ""}`}
      aria-label={label}
    >
      <CheckCircle className="h-5 w-5" />
      {label}
    </Button>
  );
}
