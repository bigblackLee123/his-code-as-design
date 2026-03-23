import { registerPreview } from "../registry";
import { CallQueue } from "@/pages/doctor-terminal/blocks/CallQueue";
import { PatientInfoBar } from "@/pages/doctor-terminal/blocks/PatientInfoBar";
import { ContraindicationInput } from "@/pages/doctor-terminal/blocks/ContraindicationInput";
import { ScaleForm } from "@/pages/doctor-terminal/blocks/ScaleForm";
import { AISuggestionPanel } from "@/pages/doctor-terminal/blocks/AISuggestionPanel";
import { StatusTransition } from "@/pages/doctor-terminal/blocks/StatusTransition";
import type { Patient, ConsultationData } from "@/services/types";

const mockPatient: Patient = {
  id: "P003",
  name: "王建国",
  gender: "male",
  age: 72,
  idNumber: "440103195207203456",
  phone: "15012349876",
  insuranceCardNo: "YB20240003",
  status: "consulting",
  createdAt: "2024-01-15T09:00:00Z",
};

const mockConsultation: ConsultationData = {
  contraindications: [
    { code: "CI001", name: "严重心律失常", pinyin: "yanzhongxinlvshichang", pinyinInitial: "YZXLSC", category: "心血管" },
  ],
  symptoms: [],
  scaleResults: null,
  aiSuggestion: null,
};

/** 禁忌症输入需要有状态的包装 */
function ContraindicationDemo() {
  return <ContraindicationInput patientId={mockPatient.id} />;
}

registerPreview({
  id: "doctor",
  title: "医生终端",
  route: "/doctor",
  blocks: [
    {
      name: "CallQueue",
      description: "候诊叫号队列",
      render: () => (
        <CallQueue onPatientCalled={() => alert("叫号成功")} disabled={false} />
      ),
    },
    {
      name: "PatientInfoBar",
      description: "患者信息栏（基本信息 + 生理数据）",
      render: () => <PatientInfoBar patient={mockPatient} />,
    },
    {
      name: "ContraindicationInput",
      description: "禁忌症搜索录入（拼音/首字母检索）",
      render: () => <ContraindicationDemo />,
    },
    {
      name: "ScaleForm",
      description: "量表评估表单",
      render: () => <ScaleForm patientId={mockPatient.id} onSubmit={() => alert("量表提交")} />,
    },
    {
      name: "AISuggestionPanel",
      description: "AI 处方建议面板",
      render: () => (
        <AISuggestionPanel
          patient={mockPatient}
          consultationData={mockConsultation}
          onAdopt={() => alert("采纳建议")}
        />
      ),
    },
    {
      name: "StatusTransition",
      description: "状态流转（转治疗队列）",
      render: () => (
        <StatusTransition
          patient={mockPatient}
          selectedProjects={[]}
          consultationData={mockConsultation}
          onComplete={() => alert("流转完成")}
        />
      ),
    },
  ],
});
