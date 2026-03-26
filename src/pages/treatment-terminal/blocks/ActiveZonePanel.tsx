import { TreatmentStageHeader } from "./TreatmentStageHeader";
import { BPMSlider } from "./BPMSlider";
import { SensorDataPanel } from "./SensorDataPanel";
import { SessionTimer } from "./SessionTimer";
import { PulseOrb } from "./PulseOrb";
import { TreatmentWarnings } from "./TreatmentWarnings";
import { FinishActionBar } from "./FinishActionBar";
import type { TherapyProject, TreatmentState } from "@/services/types";

export interface ActiveZonePanelProps {
  /** 当前区域名 */
  region: string;
  project: TherapyProject;
  treatmentState: TreatmentState;
  onEmergencyStop?: () => void;
  onFinish: () => void;
  /** 隐藏标题行（由外部渲染） */
  hideHeader?: boolean;
}

export function ActiveZonePanel({
  region,
  project,
  treatmentState,
  onEmergencyStop,
  onFinish,
  hideHeader = false,
}: ActiveZonePanelProps) {
  const isTreating = treatmentState.status === "treating";

  return (
    <div className="flex flex-col gap-3">
      {!hideHeader && (
        <TreatmentStageHeader
          title={`${region}控制面板`}
          status={isTreating ? "running" : "paused"}
        />
      )}
      {/* 三栏参数条 — 对齐静区布局 */}
      <div className="grid grid-cols-3 gap-2">
        <BPMSlider initialBpm={project.bpm ?? 80} />
        <SensorDataPanel />
        <SessionTimer
          startTime={treatmentState.startTime}
          running={isTreating}
        />
      </div>
      {/* 脉冲圆 */}
      <PulseOrb active={isTreating} />
      {/* 警告区 */}
      <TreatmentWarnings onEmergencyStop={onEmergencyStop} />
      {/* 底部操作 */}
      <FinishActionBar
        label="训练结束，生成评估报告"
        variant="primary"
        onFinish={onFinish}
      />
    </div>
  );
}
