import { registerPreview } from "../registry";
import { PatientCheckIn } from "@/pages/triage-terminal/blocks/PatientCheckIn";
import { VitalSignsInput } from "@/pages/triage-terminal/blocks/VitalSignsInput";
import { QueueAssignment } from "@/pages/triage-terminal/blocks/QueueAssignment";
import type { Patient, VitalSigns } from "@/services/types";

const mockPatient: Patient = {
  id: "P001",
  name: "张三丰",
  gender: "male",
  age: 68,
  idNumber: "110101195601151234",
  phone: "13812345678",
  insuranceCardNo: "YB20240001",
  status: "checked-in",
  createdAt: "2024-01-15T08:30:00Z",
};

const mockVitals: VitalSigns = {
  systolicBP: 135,
  diastolicBP: 85,
  heartRate: 78,
  recordedAt: new Date().toISOString(),
  recordedBy: "护士A",
};

registerPreview({
  id: "triage",
  title: "分诊终端",
  route: "/triage",
  blocks: [
    {
      name: "PatientCheckIn",
      description: "患者签到（医保卡读取 / 手动录入）",
      render: () => (
        <PatientCheckIn onCheckInComplete={() => alert("签到完成")} />
      ),
    },
    {
      name: "VitalSignsInput",
      description: "生理数据录入（收缩压、舒张压、心率）",
      render: () => (
        <VitalSignsInput patient={mockPatient} onSave={() => alert("保存成功")} />
      ),
    },
    {
      name: "QueueAssignment",
      description: "候诊队列分配",
      render: () => (
        <QueueAssignment patient={mockPatient} vitalSigns={mockVitals} onComplete={() => alert("分配完成")} />
      ),
    },
  ],
});
