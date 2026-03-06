import { cn } from "@/lib/utils";

export interface MaskedTextProps {
  /** 脱敏类型 */
  type: "name" | "idNumber" | "phone";
  /** 原始值 */
  value: string;
  /** 是否显示原始值（需权限控制） */
  revealed?: boolean;
  /** 自定义样式类 */
  className?: string;
}

export function MaskedText({
  type,
  value,
  revealed = false,
  className,
}: MaskedTextProps) {
  const masked = revealed ? value : maskValue(type, value);

  return (
    <span className={cn("font-mono text-xs leading-tight", className)}>
      {masked}
    </span>
  );
}

function maskValue(type: MaskedTextProps["type"], value: string): string {
  switch (type) {
    case "name":
      return (
        value.charAt(0) + "*".repeat(Math.max(value.length - 1, 1))
      );
    case "idNumber":
      return (
        value.slice(0, 3) +
        "*".repeat(Math.max(value.length - 7, 1)) +
        value.slice(-4)
      );
    case "phone":
      return value.slice(0, 3) + "****" + value.slice(-4);
    default:
      return value;
  }
}
