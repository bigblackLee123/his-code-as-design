import { cn } from "@/lib/utils";

const navItems = [
  "首页", "科研入组", "门/急诊入院", "开住院证", "医嘱处理",
  "门诊病历", "病历浏览", "门诊日志", "退费处理", "手术管理",
  "患者查询", "集成信息",
];

export interface GlobalNavProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

export function GlobalNav({ activeItem = "首页", onItemClick }: GlobalNavProps) {
  return (
    <nav className="flex items-center gap-0 bg-primary-700 px-2 py-0.5 overflow-x-auto" aria-label="全局导航">
      {navItems.map((item) => (
        <button
          key={item}
          onClick={() => onItemClick?.(item)}
          className={cn(
            "shrink-0 px-2 py-1 text-xs transition-colors rounded-sm",
            activeItem === item
              ? "bg-primary-500 text-white font-medium"
              : "text-primary-100 hover:bg-primary-600 hover:text-white"
          )}
        >
          {item}
        </button>
      ))}
    </nav>
  );
}
