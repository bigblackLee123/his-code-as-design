import { Activity, Brain } from "lucide-react";

export interface PatientVitalMonitorProps {
  /** 心率 BPM，demo 假数据 */
  heartRate?: number;
  /** HRV 自主神经信号 ms，demo 假数据 */
  hrv?: number;
}

export function PatientVitalMonitor({
  heartRate = 82,
  hrv = 35,
}: PatientVitalMonitorProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-3">
      <span className="text-xs font-semibold text-neutral-700 leading-tight">
        患者状态看板
      </span>
      {/* 心率 */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-neutral-500 leading-tight">心率变化</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-neutral-800 leading-tight font-mono">
              {heartRate}
            </span>
            <span className="text-xs text-neutral-400 leading-tight">BPM</span>
          </div>
        </div>
        <Activity className="h-6 w-6 text-primary-500" aria-hidden="true" />
      </div>
      {/* HRV */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-neutral-500 leading-tight">
            HRV 自主神经信号
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-neutral-800 leading-tight font-mono">
              {hrv}
            </span>
            <span className="text-xs text-neutral-400 leading-tight">ms</span>
          </div>
        </div>
        <Brain className="h-6 w-6 text-success-500" aria-hidden="true" />
      </div>
    </div>
  );
}
