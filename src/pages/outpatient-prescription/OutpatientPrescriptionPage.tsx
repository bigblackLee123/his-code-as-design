import { SystemHeader } from "./blocks/SystemHeader";
import { GlobalNav } from "./blocks/GlobalNav";
import { PatientInfoBar } from "./blocks/PatientInfoBar";
import { FunctionTabs } from "./blocks/FunctionTabs";
import { PrescriptionForm } from "./blocks/PrescriptionForm";
import { HerbGrid } from "./blocks/HerbGrid";
import { ActionBar } from "./blocks/ActionBar";
import { TemplatePanel } from "./blocks/TemplatePanel";
import { StatusBar } from "./blocks/StatusBar";

export function OutpatientPrescriptionPage() {
  return (
    <div className="flex flex-col h-screen bg-neutral-50">
      {/* 顶部系统标题栏 */}
      <SystemHeader
        systemName="天津中医药大学第一附属医院 (正式版V7.0.2)"
        doctorName="[name]"
        doctorId="D120104011981"
        department="[南院]肿瘤内科门诊"
      />

      {/* 全局导航栏 */}
      <GlobalNav />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col gap-1 p-2 overflow-auto">
        {/* 患者信息条 */}
        <PatientInfoBar
          registrationId="0005188581"
          name="[name]"
          gender="female"
          birthDate="1955/06/16"
          age={69}
          feeCategory="城职门诊"
          insuranceCardNo="622823002509883566"
        />

        {/* 功能 Tab 导航 */}
        <FunctionTabs />

        {/* 处方元数据表单 */}
        <PrescriptionForm />

        {/* 中草药处方网格（核心区域） */}
        <div className="flex-1 min-h-0">
          <HerbGrid />
        </div>

        {/* 签名 + 操作按钮栏 */}
        <ActionBar />

        {/* 底部常用模板快捷区 */}
        <TemplatePanel />
      </div>

      {/* 底部状态栏 */}
      <StatusBar
        userName="[name]"
        group="206"
        role="Outpatient Doctor"
        department="ZLNKWZ-[南院]肿瘤内科门诊"
      />
    </div>
  );
}
