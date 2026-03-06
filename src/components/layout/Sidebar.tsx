import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Stethoscope,
  BedDouble,
  Users,
  ClipboardList,
  Pill,
  TestTube,
  Calendar,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <Users className="h-4 w-4" />, label: "患者管理", href: "/patients" },
  { icon: <BedDouble className="h-4 w-4" />, label: "床位管理", href: "/beds" },
  { icon: <ClipboardList className="h-4 w-4" />, label: "医嘱管理", href: "/orders" },
  { icon: <Stethoscope className="h-4 w-4" />, label: "门诊管理", href: "/outpatient" },
  { icon: <Pill className="h-4 w-4" />, label: "药品管理", href: "/pharmacy" },
  { icon: <TestTube className="h-4 w-4" />, label: "检验管理", href: "/lab" },
  { icon: <Calendar className="h-4 w-4" />, label: "排班管理", href: "/schedule" },
  { icon: <Activity className="h-4 w-4" />, label: "监护记录", href: "/monitoring" },
];

export interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapsedChange }: SidebarProps) {
  const [active, setActive] = useState("/patients");

  return (
    <aside
      className={cn(
        "flex flex-col bg-neutral-900 text-neutral-50 transition-all duration-200",
        collapsed ? "w-14" : "w-48"
      )}
    >
      {/* Logo 区域 */}
      <div className="flex items-center gap-2 p-3 border-b border-neutral-700">
        <Stethoscope className="h-5 w-5 text-primary-400" />
        {!collapsed && (
          <span className="text-sm font-semibold text-neutral-50">HIS 系统</span>
        )}
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 flex flex-col gap-1 p-2" aria-label="主导航">
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => setActive(item.href)}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
              active === item.href
                ? "bg-primary-600 text-neutral-50"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-50"
            )}
            aria-current={active === item.href ? "page" : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* 折叠按钮 */}
      <button
        onClick={() => onCollapsedChange?.(!collapsed)}
        className="flex items-center justify-center p-2 border-t border-neutral-700 text-neutral-400 hover:text-neutral-50 transition-colors"
        aria-label={collapsed ? "展开导航栏" : "折叠导航栏"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}
