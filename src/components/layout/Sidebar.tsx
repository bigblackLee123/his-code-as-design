import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Syringe,
  Eye,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <HeartPulse className="h-4 w-4" />, label: "分诊终端", href: "/triage" },
  { icon: <Stethoscope className="h-4 w-4" />, label: "医生终端", href: "/doctor" },
  { icon: <Syringe className="h-4 w-4" />, label: "治疗终端", href: "/treatment" },
  { icon: <Eye className="h-4 w-4" />, label: "组件预览", href: "/preview" },
];

export interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapsedChange }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex flex-col bg-neutral-900 text-neutral-50 transition-all duration-200",
        collapsed ? "w-14" : "w-40"
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
      <nav className="flex-1 flex flex-col gap-1 p-2 overflow-auto" aria-label="主导航">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                isActive
                  ? "bg-primary-600 text-neutral-50"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-50"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
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
