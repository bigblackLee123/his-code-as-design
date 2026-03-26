import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Music, Users, Info } from "lucide-react";

export interface BPMSliderProps {
  initialBpm?: number;
  min?: number;
  max?: number;
  /** 项目名，大面板模式下显示 */
  projectName?: string;
  /** 机制描述 */
  mechanism?: string;
  /** 适用人群 */
  targetAudience?: string;
}

export function BPMSlider({
  initialBpm = 80,
  min = 60,
  max = 140,
  projectName,
  mechanism,
  targetAudience,
}: BPMSliderProps) {
  const [bpm, setBpm] = useState(initialBpm);

  const handleInputChange = (raw: string) => {
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      setBpm(Math.min(max, Math.max(min, num)));
    }
    if (raw === "") setBpm(min);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 h-80">
      {/* 标题 */}
      <div className="flex items-center gap-1.5">
        <Music className="h-4 w-4 text-success-600" aria-hidden="true" />
        <span className="text-xs font-semibold text-neutral-800 leading-tight">
          RAS 节奏听觉刺激
        </span>
      </div>

      {/* 项目名 */}
      {projectName && (
        <span className="text-sm font-bold text-neutral-800 leading-tight">
          {projectName}
        </span>
      )}

      {/* BPM 输入 + 滑块 */}
      <div className="flex items-center gap-3">
        <Input
          type="number"
          value={bpm}
          onChange={(e) => handleInputChange(e.target.value)}
          min={min}
          max={max}
          className="w-24 text-2xl font-bold text-neutral-800 font-mono h-10 px-2"
          aria-label="BPM 输入"
        />
        <span className="text-sm text-neutral-400 leading-tight">BPM</span>
        <span className="text-xs text-neutral-500 leading-tight ml-auto">
          步态配合节拍
        </span>
      </div>

      <div className="py-1">
        <Slider
          defaultValue={[bpm]}
          onValueChange={(v) => setBpm(Array.isArray(v) ? v[0] : v)}
          min={min}
          max={max}
          step={1}
          aria-label="BPM 调节滑块"
        />
      </div>
      <div className="flex justify-between text-xs text-neutral-400 leading-tight font-mono">
        <span>{min}</span>
        <span>{max}</span>
      </div>

      {/* 机制描述 */}
      {mechanism && (
        <div className="flex gap-1.5 rounded-lg bg-neutral-50 p-2">
          <Info className="h-3 w-3 text-neutral-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-neutral-600 leading-relaxed">{mechanism}</p>
        </div>
      )}

      {/* 适用人群 */}
      {targetAudience && (
        <div className="flex items-center gap-1.5">
          <Users className="h-3 w-3 text-neutral-400" aria-hidden="true" />
          <span className="text-xs text-neutral-500 leading-tight">
            适用人群：{targetAudience}
          </span>
        </div>
      )}
    </div>
  );
}
