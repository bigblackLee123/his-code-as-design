import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Stethoscope,
  Syringe,
  Monitor,
  Eye,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: HeartPulse, label: "分诊终端", href: "/triage" },
  { icon: Stethoscope, label: "医生终端", href: "/doctor" },
  { icon: Syringe, label: "治疗终端", href: "/treatment" },
  { icon: Monitor, label: "中枢终端", href: "/middle" },
  { icon: Eye, label: "组件预览", href: "/preview" },
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
        "flex flex-col bg-white rounded-2xl shadow-sm border border-neutral-200 transition-all duration-200 shrink-0 overflow-hidden",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* 导航标题 */}
      <div className="px-4 pt-4 pb-2">
        <h2 className={cn("text-xs font-bold text-neutral-400 uppercase tracking-widest whitespace-nowrap transition-opacity duration-200", collapsed ? "opacity-0" : "opacity-100")}>
          诊疗路径导航
        </h2>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 flex flex-col gap-1 p-2 overflow-auto" aria-label="主导航">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-xl py-3 text-sm font-semibold transition-all whitespace-nowrap",
                collapsed ? "justify-center px-0" : "gap-3 px-4",
                isActive
                  ? cn("bg-primary-50 text-primary-700 shadow-sm", !collapsed && "border-l-4 border-primary-600")
                  : "text-neutral-500 hover:bg-neutral-50"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className={cn("transition-all duration-200 overflow-hidden", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 底部说明 */}
      <div className={cn("overflow-hidden transition-all duration-200", collapsed ? "h-0 opacity-0" : "h-auto opacity-100")}>
        <div className="m-3 p-3 bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
          <p className="text-xs text-neutral-400 leading-relaxed text-center">
            耳界疗愈大模型提供临床支持
          </p>
        </div>
      </div>

      {/* 折叠按钮 */}
      <button
        onClick={() => onCollapsedChange?.(!collapsed)}
        className="flex items-center justify-center p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
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
