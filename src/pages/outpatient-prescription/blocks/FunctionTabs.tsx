import { cn } from "@/lib/utils";

const primaryTabs = [
  "西医诊疗录入", "中医诊断录入", "医保录入", "中草药录入",
  "药房管理", "检查检验", "临床路径", "病历转诊", "护理记录",
  "诊疗记录", "次均费用", "模板上传", "公共卫生信息",
];

const secondaryTabs = [
  "医保门诊网上结算", "医保门诊同下结算", "医保门大网上结算",
  "目录", "城职门诊特殊病", "城职门大送审病", "国家医保药品",
];

export interface FunctionTabsProps {
  activePrimary?: string;
  activeSecondary?: string;
  onPrimaryChange?: (tab: string) => void;
  onSecondaryChange?: (tab: string) => void;
}

export function FunctionTabs({
  activePrimary = "中草药录入",
  activeSecondary = "医保门诊网上结算",
  onPrimaryChange,
  onSecondaryChange,
}: FunctionTabsProps) {
  return (
    <div className="flex flex-col gap-0">
      {/* 二级功能 Tab */}
      <div className="flex items-center gap-0 bg-neutral-100 border-b border-neutral-200 px-2 overflow-x-auto">
        {primaryTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onPrimaryChange?.(tab)}
            className={cn(
              "shrink-0 px-2 py-1 text-xs transition-colors border-b-2",
              activePrimary === tab
                ? "border-primary-500 text-primary-700 font-medium bg-white"
                : "border-transparent text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* 三级功能 Tab（医保结算方式） */}
      <div className="flex items-center gap-0 bg-white border-b border-neutral-200 px-2 overflow-x-auto">
        {secondaryTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onSecondaryChange?.(tab)}
            className={cn(
              "shrink-0 px-2 py-1 text-xs transition-colors",
              activeSecondary === tab
                ? "text-primary-600 font-medium bg-primary-50 rounded-sm"
                : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
