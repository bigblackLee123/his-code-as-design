import { Thermometer, Timer, Scale, Wifi } from "lucide-react";

interface SensorItem {
  label: string;
  value: string;
  unit: string;
  icon: typeof Wifi;
}

const SENSORS: SensorItem[] = [
  { label: "体温调节", value: "--", unit: "°C", icon: Thermometer },
  { label: "节奏同步率", value: "--", unit: "%", icon: Timer },
  { label: "平衡稳定度", value: "--", unit: "", icon: Scale },
];

export function SensorDataPanel() {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-success-200 bg-success-50/50 p-3">
      <div className="flex items-center gap-1">
        <Wifi className="h-3 w-3 text-success-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-700 leading-tight">
          运动传感器数据
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {SENSORS.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <div key={sensor.label}>
              <div className="flex items-center gap-1 mb-0.5">
                <Icon className="h-3 w-3 text-neutral-400" aria-hidden="true" />
                <span className="text-xs text-neutral-500 leading-tight">{sensor.label}</span>
              </div>
              <div className="flex items-baseline gap-0.5 pl-4">
                <span className="text-sm font-mono font-bold text-neutral-800 leading-tight">
                  {sensor.value}
                </span>
                {sensor.unit && (
                  <span className="text-xs text-neutral-400 leading-tight">{sensor.unit}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
