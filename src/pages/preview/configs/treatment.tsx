import { registerPreview } from "../registry";
import { TreatmentQueue } from "@/pages/treatment-terminal/blocks/TreatmentQueue";
import { TreatmentPatientView } from "@/pages/treatment-terminal/blocks/TreatmentPatientView";
import { TreatmentAction } from "@/pages/treatment-terminal/blocks/TreatmentAction";
import { PostVitalSigns } from "@/pages/treatment-terminal/blocks/PostVitalSigns";
import { PostScaleForm } from "@/pages/treatment-terminal/blocks/PostScaleForm";
import { QueueComplete } from "@/pages/treatment-terminal/blocks/QueueComplete";
import { TreatmentStageHeader } from "@/pages/treatment-terminal/blocks/TreatmentStageHeader";
import { PatientInfoCard } from "@/pages/doctor-terminal/blocks/PatientInfoCard";
import { FinishActionBar } from "@/pages/treatment-terminal/blocks/FinishActionBar";
import { PulseOrb } from "@/pages/treatment-terminal/blocks/PulseOrb";
import { FrequencyCard } from "@/pages/treatment-terminal/blocks/FrequencyCard";
import { MoodCard } from "@/pages/treatment-terminal/blocks/MoodCard";
import { SessionTimer } from "@/pages/treatment-terminal/blocks/SessionTimer";
import { BPMSlider } from "@/pages/treatment-terminal/blocks/BPMSlider";
import { SensorDataPanel } from "@/pages/treatment-terminal/blocks/SensorDataPanel";
import { StaticZonePanel } from "@/pages/treatment-terminal/blocks/StaticZonePanel";
import { ActiveZonePanel } from "@/pages/treatment-terminal/blocks/ActiveZonePanel";
import type { TreatmentPatient, TreatmentState, VitalSigns } from "@/services/types";
import { mockTherapyProjects } from "@/services/mock/data/therapyProjects";

const mockVitals: VitalSigns = {
  systolicBP: 135,
  diastolicBP: 85,
  heartRate: 78,
  recordedAt: new Date().toISOString(),
  recordedBy: "护士A",
};

const mockPostVitals: VitalSigns = {
  systolicBP: 125,
  diastolicBP: 80,
  heartRate: 72,
  recordedAt: new Date().toISOString(),
  recordedBy: "护士A",
};

const mockTreatmentPatient: TreatmentPatient = {
  id: "P004",
  name: "赵美玲",
  gender: "female",
  age: 38,
  idNumber: "510105198605124567",
  phone: "18623456789",
  insuranceCardNo: "YB20240004",
  status: "treating",
  createdAt: "2024-01-15T09:15:00Z",
  vitalSigns: mockVitals,
  contraindications: [
    { code: "CI001", name: "严重心律失常", pinyin: "yanzhongxinlvshichang", pinyinInitial: "YZXLSC", category: "心血管" },
  ],
  projects: mockTherapyProjects.slice(0, 3),
};

const treatingState: TreatmentState = {
  status: "treating",
  startTime: new Date(Date.now() - 600_000),
  endTime: null,
};

const completingState: TreatmentState = {
  status: "completing",
  startTime: new Date(Date.now() - 1_800_000),
  endTime: new Date(Date.now() - 60_000),
};

registerPreview({
  id: "treatment",
  title: "治疗终端",
  route: "/treatment",
  blocks: [
    {
      name: "TreatmentQueue",
      description: "治疗队列（刷卡签到）",
      render: () => (
        <TreatmentQueue region="睡眠区" onCheckIn={() => alert("签到成功")} disabled={false} />
      ),
    },
    {
      name: "TreatmentPatientView",
      description: "治疗患者信息（基本信息 + 生理数据 + 处方）",
      render: () => <TreatmentPatientView patient={mockTreatmentPatient} />,
    },
    {
      name: "TreatmentAction（治疗中）",
      description: "治疗计时器 — 治疗进行中状态",
      render: () => (
        <TreatmentAction state={treatingState} onStart={() => {}} onEnd={() => alert("结束治疗")} />
      ),
    },
    {
      name: "PostVitalSigns",
      description: "治疗后生理数据录入（含前后对比）",
      render: () => (
        <PostVitalSigns preVitals={mockVitals} onSave={() => alert("保存成功")} />
      ),
    },
    {
      name: "PostScaleForm",
      description: "治疗后量表评估",
      render: () => <PostScaleForm onSubmit={() => alert("量表提交")} />,
    },
    {
      name: "QueueComplete",
      description: "出队确认（含生理数据前后对比）",
      render: () => (
        <QueueComplete
          patient={mockTreatmentPatient}
          treatmentState={completingState}
          postVitals={mockPostVitals}
          onComplete={() => alert("出队完成")}
        />
      ),
    },
    // ── 可复用组件 ──
    {
      name: "TreatmentStageHeader（进行中）",
      description: "阶段标题栏 — 进行中状态",
      render: () => <TreatmentStageHeader title="静区干预控制面板" status="running" />,
    },
    {
      name: "TreatmentStageHeader（已暂停）",
      description: "阶段标题栏 — 已暂停状态",
      render: () => <TreatmentStageHeader title="静区干预控制面板" status="paused" />,
    },
    {
      name: "PatientInfoCard（复用医生终端）",
      description: "右侧边栏 — 患者状态看板（复用医生终端 PatientInfoCard）",
      render: () => <PatientInfoCard patient={mockTreatmentPatient} />,
    },
    {
      name: "FinishActionBar（静区）",
      description: "底部操作 — 疗程结束按钮",
      render: () => <FinishActionBar label="疗程结束，生成评估报告" variant="primary" onFinish={() => alert("生成报告")} />,
    },
    {
      name: "FinishActionBar（动区）",
      description: "底部操作 — 训练结束按钮",
      render: () => <FinishActionBar label="训练结束，生成评估报告" variant="success" onFinish={() => alert("生成报告")} />,
    },
    {
      name: "PulseOrb",
      description: "脉冲圆动画 — 治疗中核心视觉",
      render: () => <PulseOrb active />,
    },
    // ── 静区专属组件 ──
    {
      name: "FrequencyCard（有频率）",
      description: "声波频光卡片 — 舒曼波 7.83Hz",
      render: () => <FrequencyCard frequency="7.83Hz" frequencyBand="舒曼波/Alpha波段" bpm={50} mechanism="舒曼波的频段与人大脑的alpha波频率相似" />,
    },
    {
      name: "FrequencyCard（无频率 fallback BPM）",
      description: "声波频光卡片 — 无频率时显示 BPM",
      render: () => <FrequencyCard frequency={null} frequencyBand={null} bpm={55} mechanism="自然情境深度减压，全身体感放松海浪" />,
    },
    {
      name: "MoodCard",
      description: "情绪导向卡片 — mood + energyLevel",
      render: () => <MoodCard mood="平静、温暖" energyLevel="深度镇静" />,
    },
    {
      name: "SessionTimer",
      description: "执行时长卡片 — 计时器",
      render: () => <SessionTimer startTime={new Date(Date.now() - 600_000)} running totalDuration={1500} />,
    },
    // ── 动区专属组件 ──
    {
      name: "BPMSlider",
      description: "RAS 节奏听觉刺激 — BPM 滑块 + 输入框",
      render: () => <BPMSlider initialBpm={80} min={60} max={140} />,
    },
    {
      name: "SensorDataPanel",
      description: "运动传感器数据（demo 显示 --）",
      render: () => <SensorDataPanel />,
    },
    // ── 面板容器 ──
    {
      name: "StaticZonePanel（静区面板）",
      description: "静区干预完整面板 — 舒曼波项目",
      render: () => (
        <StaticZonePanel
          region="睡眠区"
          project={mockTherapyProjects[0]!}
          treatmentState={treatingState}
          onEmergencyStop={() => alert("紧急停止")}
          onFinish={() => alert("生成报告")}
        />
      ),
    },
    {
      name: "ActiveZonePanel（动区面板）",
      description: "动区康复完整面板 — 步态调整项目",
      render: () => (
        <ActiveZonePanel
          region="运动疗愈区"
          project={mockTherapyProjects.find((p) => p.region === "运动疗愈区")!}
          treatmentState={treatingState}
          onEmergencyStop={() => alert("紧急停止")}
          onFinish={() => alert("生成报告")}
        />
      ),
    },
  ],
});
