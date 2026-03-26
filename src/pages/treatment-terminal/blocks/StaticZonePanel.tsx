import { TreatmentStageHeader } from "./TreatmentStageHeader";
import { FrequencyCard } from "./FrequencyCard";
import { MoodCard } from "./MoodCard";
import { SessionTimer } from "./SessionTimer";
import { PulseOrb } from "./PulseOrb";
import { TreatmentWarnings } from "./TreatmentWarnings";
import { FinishActionBar } from "./FinishActionBar";
import type { TherapyProject, TreatmentState } from "@/services/types";

export interface StaticZonePanelProps {
  /** 当前区域名 */
  region: string;
  /** 当前治疗的第一个项目（取频率/调式信息） */
  project: TherapyProject;
  /** 治疗状态 */
  treatmentState: TreatmentState;
  /** 紧急停止 */
  onEmergencyStop?: () => void;
  /** 结束治疗 */
  onFinish: () => void;
  /** 隐藏标题行（由外部渲染） */
  hideHeader?: boolean;
}

export function StaticZonePanel({
  region,
  project,
  treatmentState,
  onEmergencyStop,
  onFinish,
  hideHeader = false,
}: StaticZonePanelProps) {
  const isTreating = treatmentState.status === "treating";

  return (
    <div className="flex flex-col gap-3">
      {!hideHeader && (
        <TreatmentStageHeader
          title={`${region}控制面板`}
          status={isTreating ? "running" : "paused"}
        />
      )}
      {/* 三栏参数条 */}
      <div className="grid grid-cols-3 gap-2">
        <FrequencyCard
          frequency={project.frequency}
          frequencyBand={project.frequencyBand}
          bpm={project.bpm}
          mechanism={project.mechanism}
        />
        <MoodCard mood={project.mood} energyLevel={project.energyLevel} />
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
        label="疗程结束，生成评估报告"
        variant="primary"
        onFinish={onFinish}
      />
    </div>
  );
}
