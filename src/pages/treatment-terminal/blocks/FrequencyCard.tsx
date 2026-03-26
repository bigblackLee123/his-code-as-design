import { Radio } from "lucide-react";

export interface FrequencyCardProps {
  /** 频率值，如 "7.83Hz"，null 时 fallback 到 BPM */
  frequency: string | null;
  /** 频段描述，如 "舒曼波/Alpha波段"，null 时从 mechanism 截取 */
  frequencyBand: string | null;
  /** BPM 值，frequency 为空时作为 fallback */
  bpm: number | null;
  /** mechanism 描述，frequencyBand 为空时截取前 15 字 */
  mechanism: string;
}

export function FrequencyCard({ frequency, frequencyBand, bpm, mechanism }: FrequencyCardProps) {
  const mainValue = frequency ?? (bpm ? `${bpm} BPM` : "--");
  const subLabel = frequencyBand ?? (mechanism ? mechanism.slice(0, 15) : "--");

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-white p-3">
      <div className="flex items-center gap-1">
        <Radio className="h-3 w-3 text-primary-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-500 leading-tight">声波频光</span>
      </div>
      {/* 进度条装饰 */}
      <div className="h-1 w-full rounded-full bg-neutral-100 overflow-hidden">
        <div className="h-full w-3/5 rounded-full bg-primary-500" />
      </div>
      <span className="text-lg font-bold text-neutral-800 leading-tight font-mono">
        {mainValue}
      </span>
      <span className="text-xs text-neutral-500 leading-tight">{subLabel}</span>
    </div>
  );
}
