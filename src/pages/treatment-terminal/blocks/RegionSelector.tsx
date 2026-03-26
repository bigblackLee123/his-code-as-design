import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Moon, Heart, Footprints } from "lucide-react";

export interface RegionSelectorProps {
  onSelect: (region: string) => void;
}

const REGIONS = [
  { id: "睡眠区", label: "睡眠区", icon: Moon, color: "text-primary-700 bg-primary-50 border-primary-200 hover:bg-primary-100" },
  { id: "情志区", label: "情志区", icon: Heart, color: "text-primary-700 bg-primary-50 border-primary-200 hover:bg-primary-100" },
  { id: "运动疗愈区", label: "运动疗愈区", icon: Footprints, color: "text-success-700 bg-success-50 border-success-200 hover:bg-success-100" },
] as const;

export function RegionSelector({ onSelect }: RegionSelectorProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary-500" />
        <span className="text-sm font-semibold text-neutral-800">请选择本终端所属房间</span>
      </div>
      <div className="grid grid-cols-3 gap-4 w-full max-w-xl">
        {REGIONS.map(({ id, label, icon: Icon, color }) => (
          <Card
            key={id}
            className={`cursor-pointer border-2 rounded-2xl transition-all ${color}`}
            onClick={() => onSelect(id)}
            role="button"
            tabIndex={0}
            aria-label={`选择${label}`}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(id); }}
          >
            <CardHeader className="items-center pb-1 pt-4">
              <Icon className="h-10 w-10" />
            </CardHeader>
            <CardContent className="text-center pb-4">
              <CardTitle className="text-sm font-semibold">{label}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
