import { registerPreview } from "../registry";
import { TreatmentQueue } from "@/pages/treatment-terminal/blocks/TreatmentQueue";
import { TreatmentPatientView } from "@/pages/treatment-terminal/blocks/TreatmentPatientView";
import { TreatmentAction } from "@/pages/treatment-terminal/blocks/TreatmentAction";
import { PostVitalSigns } from "@/pages/treatment-terminal/blocks/PostVitalSigns";
import { PostScaleForm } from "@/pages/treatment-terminal/blocks/PostScaleForm";
import { QueueComplete } from "@/pages/treatment-terminal/blocks/QueueComplete";
import type { TreatmentPatient, TreatmentState, VitalSigns } from "@/services/types";
import { mockTherapyPackages } from "@/services/mock/data/therapyPackages";

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
    { code: "CI002", name: "阴虚火旺", pinyin: "yinxuhuowang", pinyinInitial: "YXHW", category: "体质禁忌" },
  ],
  therapyPackage: mockTherapyPackages[0]!,
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
      description: "治疗队列（叫号）",
      render: () => (
        <TreatmentQueue onPatientCalled={() => alert("叫号成功")} disabled={false} />
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
  ],
});
