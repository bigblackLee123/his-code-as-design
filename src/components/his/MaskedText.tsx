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
      // 姓名脱敏规则：
      // - 三个字及以上：显示第一个字和最后一个字，中间用*替代（如：张*丰）
      // - 两个字：第一个字显示，第二个字用*替代（如：张*）
      // - 单字：显示原字（如：张）
      if (value.length >= 3) {
        return value.charAt(0) + "*".repeat(value.length - 2) + value.charAt(value.length - 1);
      } else if (value.length === 2) {
        return value.charAt(0) + "*";
      } else {
        return value;
      }
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
