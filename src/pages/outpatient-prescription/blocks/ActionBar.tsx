import { cn } from "@/lib/utils";
import { Lock, Search, FileText, Trash2, Plus, Upload } from "lucide-react";

const actions = [
  { label: "审核医嘱(U)", icon: FileText, variant: "primary" as const },
  { label: "处方查询", icon: Search, variant: "outline" as const },
  { label: "常用模板维护", icon: FileText, variant: "outline" as const },
  { label: "清除", icon: Trash2, variant: "outline" as const },
  { label: "新建", icon: Plus, variant: "outline" as const },
  { label: "处方上传", icon: Upload, variant: "primary" as const },
];

export interface ActionBarProps {
  onAction?: (action: string) => void;
}

export function ActionBar({ onAction }: ActionBarProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-md border border-neutral-200 px-3 py-1.5">
      {/* 签名密码 */}
      <div className="flex items-center gap-2">
        <Lock className="h-3 w-3 text-neutral-400" aria-hidden="true" />
        <label className="text-xs text-neutral-600">签名密码</label>
        <div className="w-24 h-7 rounded border border-neutral-200 bg-neutral-50 px-2 flex items-center text-xs text-neutral-700 font-mono">
          ••••
        </div>
      </div>

      {/* 操作按钮组 */}
      <div className="flex items-center gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => onAction?.(action.label)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors",
                action.variant === "primary"
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              )}
            >
              <Icon className="h-3 w-3" aria-hidden="true" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
