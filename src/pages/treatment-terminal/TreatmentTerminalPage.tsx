import { RegionSelector } from "./blocks/RegionSelector";
import { TreatmentQueue } from "./blocks/TreatmentQueue";
import { TreatmentPatientView } from "./blocks/TreatmentPatientView";
import { TreatmentAction } from "./blocks/TreatmentAction";
import { TreatmentHeaderSlot } from "./blocks/TreatmentHeaderSlot";
import { TreatmentStageHeader } from "./blocks/TreatmentStageHeader";
import { FrequencyCard } from "./blocks/FrequencyCard";
import { MoodCard } from "./blocks/MoodCard";
import { SessionTimer } from "./blocks/SessionTimer";
import { BPMSlider } from "./blocks/BPMSlider";
import { SensorDataPanel } from "./blocks/SensorDataPanel";
import { PulseOrb } from "./blocks/PulseOrb";
import { TreatmentWarnings } from "./blocks/TreatmentWarnings";
import { FinishActionBar } from "./blocks/FinishActionBar";
import { GuidanceScriptCard } from "./blocks/GuidanceScriptCard";
import { PatientInfoCard } from "@/pages/doctor-terminal/blocks/PatientInfoCard";
import { RoomCompleteCheck } from "./blocks/RoomCompleteCheck";
import { PostVitalSigns } from "./blocks/PostVitalSigns";
import { PostScaleForm } from "./blocks/PostScaleForm";
import { QueueComplete } from "./blocks/QueueComplete";
import { useTreatmentFlow } from "./blocks/useTreatmentFlow";
import { Syringe, MapPin } from "lucide-react";

export function TreatmentTerminalPage() {
  const {
    region,
    pageStatus,
    currentPatient,
    consultationId,
    treatmentState,
    postVitals,
    postScaleResult,
    handleRegionSelect,
    handleCheckIn,
    handleStart,
    handleEnd,
    handleAllDone,
    handleNextPatient,
    handlePostVitalsSave,
    handlePostScaleSubmit,
    handleComplete,
  } = useTreatmentFlow();

  if (pageStatus === "region-select" || !region) {
    return (
      <div className="flex h-full bg-neutral-50">
        <RegionSelector onSelect={handleRegionSelect} />
      </div>
    );
  }

  const isStaticZone = region === "睡眠区" || region === "情志区";
  const isTreating = pageStatus === "treating";
  const firstProject = currentPatient?.projects[0] ?? null;

  // treating 时：跟医生终端 plan 步骤一样的 grid 布局
  if (isTreating && currentPatient && firstProject) {
    return (
      <>
        <TreatmentHeaderSlot region={region} patient={currentPatient} />
        <div className="flex flex-col h-full gap-2 p-3 overflow-hidden">
          {/* 标题行 */}
          <TreatmentStageHeader
            title={`${region}控制面板`}
            status="running"
          />
          {/* grid：左右两栏 */}
          <div className="grid flex-1 grid-cols-[1fr_20rem] grid-rows-[auto_auto_1fr] gap-3 min-h-0">
            {/* R1 左：静区=提词器，动区=BPM 大面板 */}
            {isStaticZone ? (
              <GuidanceScriptCard script={firstProject.guidanceScript} projectName={firstProject.name} />
            ) : (
              <BPMSlider
                initialBpm={firstProject.bpm ?? 80}
                projectName={firstProject.name}
                mechanism={firstProject.mechanism}
                targetAudience={firstProject.targetAudience}
              />
            )}
            {/* R1 右：PatientInfoCard */}
            <PatientInfoCard patient={currentPatient} />

            {/* R2 左：脉冲圆 | R2 右：静区=FrequencyCard+MoodCard，动区=SensorDataPanel */}
            <PulseOrb active projectName={firstProject.name} bpm={firstProject.bpm} />
            {isStaticZone ? (
              <div className="flex flex-col gap-3">
                <FrequencyCard
                  frequency={firstProject.frequency}
                  frequencyBand={firstProject.frequencyBand}
                  bpm={firstProject.bpm}
                  mechanism={firstProject.mechanism}
                />
                <MoodCard mood={firstProject.mood} energyLevel={firstProject.energyLevel} />
              </div>
            ) : (
              <SensorDataPanel />
            )}

            {/* R3 左：警告 | R3 右：SessionTimer + 结束按钮 */}
            <div className="overflow-y-auto min-h-0">
              <TreatmentWarnings onEmergencyStop={handleEnd} />
            </div>
            <div className="flex flex-col gap-3 h-full">
              <div className="flex-1">
                <SessionTimer startTime={treatmentState.startTime} running className="h-full" />
              </div>
              <div className="flex-1">
                <FinishActionBar
                  label="疗程结束，生成评估报告"
                  variant="primary"
                  onFinish={handleEnd}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 非 treating 状态：左队列 + 右工作区
  return (
    <div className="flex h-full gap-2 p-2">
      <div className="w-64 shrink-0 flex flex-col gap-2">
        <div className="flex items-center gap-1 px-1">
          <MapPin className="h-3 w-3 text-primary-500" />
          <span className="text-xs font-medium text-primary-700 leading-tight">{region}</span>
        </div>
        <TreatmentQueue
          region={region}
          onCheckIn={handleCheckIn}
          disabled={!!currentPatient}
        />
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-auto">
        {currentPatient ? (
          <>
            {pageStatus === "checked-in" && (
              <>
                <TreatmentPatientView patient={currentPatient} />
                <TreatmentAction
                  state={treatmentState}
                  onStart={handleStart}
                  onEnd={handleEnd}
                />
              </>
            )}
            {pageStatus === "room-completing" && consultationId && region && (
              <RoomCompleteCheck
                consultationId={consultationId}
                region={region}
                onAllDone={handleAllDone}
                onNextPatient={handleNextPatient}
              />
            )}
            {pageStatus === "post-vitals" && (
              <PostVitalSigns
                preVitals={currentPatient.vitalSigns}
                onSave={handlePostVitalsSave}
              />
            )}
            {pageStatus === "post-scale" && (
              <PostScaleForm onSubmit={handlePostScaleSubmit} />
            )}
            {pageStatus === "completing" && (
              <QueueComplete
                patient={currentPatient}
                treatmentState={treatmentState}
                postVitals={postVitals}
                postScaleResult={postScaleResult}
                onComplete={handleComplete}
              />
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 gap-2">
            <Syringe className="h-6 w-6" />
            <span className="text-xs leading-tight">请刷卡签到开始治疗</span>
          </div>
        )}
      </div>
    </div>
  );
}
