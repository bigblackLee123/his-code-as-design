import { Heart } from "lucide-react";

export interface MoodCardProps {
  /** 情绪导向，如「平静」「积极、欢快」 */
  mood: string;
  /** 能量等级，如「深度镇静」「中度激活」 */
  energyLevel: string;
}

export function MoodCard({ mood, energyLevel }: MoodCardProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-white p-3">
      <div className="flex items-center gap-1">
        <Heart className="h-3 w-3 text-primary-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-500 leading-tight">调式组织</span>
      </div>
      <span className="text-lg font-bold text-neutral-800 leading-tight">
        {mood || "--"}
      </span>
      <span className="text-xs text-neutral-500 leading-tight">
        {energyLevel || "--"}
      </span>
    </div>
  );
}
