import { cn } from "@/lib/utils";
import { Pill } from "lucide-react";

export interface HerbItem {
  name: string;
  dosage: number;
  unit: string;
  note?: string;
}

export interface HerbGridProps {
  herbs?: HerbItem[];
  onHerbChange?: (index: number, herb: HerbItem) => void;
  columns?: 4 | 5;
}

const placeholderHerbs: HerbItem[] = [
  { name: "陈皮(炙)", dosage: 10, unit: "g" },
  { name: "法半夏(炙)", dosage: 5, unit: "g" },
  { name: "炒白术(炙)", dosage: 15, unit: "g" },
  { name: "莲子仁(炙)", dosage: 15, unit: "g" },
  { name: "炒薏仁(炙)", dosage: 10, unit: "g" },
  { name: "中枣零(炙)", dosage: 15, unit: "g" },
  { name: "黄芪片(炙)", dosage: 15, unit: "g" },
  { name: "北虫草(炙)", dosage: 8, unit: "g" },
  { name: "玫瑰花(炙)", dosage: 6, unit: "g" },
  { name: "归心木(炙)", dosage: 10, unit: "g" },
  { name: "白芍(炙)", dosage: 15, unit: "g" },
  { name: "枸杞子(炙)", dosage: 15, unit: "g" },
  { name: "首乌藤(炙)", dosage: 15, unit: "g" },
  { name: "合欢花(炙)", dosage: 15, unit: "g" },
  { name: "白花蛇舌草", dosage: 15, unit: "g" },
  { name: "青蒿子(炙)", dosage: 10, unit: "g" },
  { name: "浙贝母(炙)", dosage: 10, unit: "g" },
  { name: "炙甘草(炙)", dosage: 10, unit: "g" },
  { name: "香薷(炙)", dosage: 10, unit: "g" },
  { name: "——", dosage: 0, unit: "g" },
];

export function HerbGrid({ herbs = placeholderHerbs, columns = 5 }: HerbGridProps) {
  // 将药品按列数分组填充到网格
  const gridCols = columns === 5 ? "grid-cols-5" : "grid-cols-4";

  return (
    <div className="flex flex-col gap-1 bg-white rounded-md border border-neutral-200 p-2">
      {/* 表头 */}
      <div className={cn("grid gap-1", gridCols)}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_40px_24px_40px] gap-0.5 items-center">
            <span className="text-xs font-medium text-neutral-600 leading-tight px-1">药品名称</span>
            <span className="text-xs font-medium text-neutral-600 leading-tight text-center">数量</span>
            <span />
            <span className="text-xs font-medium text-neutral-600 leading-tight text-center">备注</span>
          </div>
        ))}
      </div>

      {/* 药品网格 */}
      <div className={cn("grid gap-1", gridCols)}>
        {herbs.map((herb, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_40px_24px_40px] gap-0.5 items-center"
          >
            <div className="flex items-center gap-1 h-7 rounded border border-neutral-200 bg-neutral-50 px-1">
              <Pill className="h-3 w-3 text-primary-400 shrink-0" aria-hidden="true" />
              <span className="text-xs text-neutral-700 leading-tight truncate">
                {herb.name}
              </span>
            </div>
            <div className="h-7 rounded border border-neutral-200 bg-neutral-50 flex items-center justify-center">
              <span className="text-xs font-mono text-neutral-700">
                {herb.dosage > 0 ? herb.dosage : ""}
              </span>
            </div>
            <div className="h-7 flex items-center justify-center">
              <span className="text-xs text-neutral-400">{herb.dosage > 0 ? herb.unit : ""}</span>
            </div>
            <div className="h-7 rounded border border-neutral-200 bg-neutral-50 flex items-center justify-center">
              <span className="text-xs text-neutral-400">{herb.note || ""}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 空行占位 */}
      <div className={cn("grid gap-1", gridCols)}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_40px_24px_40px] gap-0.5 items-center">
            <div className="h-7 rounded border border-dashed border-neutral-200 bg-white" />
            <div className="h-7 rounded border border-dashed border-neutral-200 bg-white" />
            <div className="h-7" />
            <div className="h-7 rounded border border-dashed border-neutral-200 bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
}
