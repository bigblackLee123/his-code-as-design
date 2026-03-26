import { useHeaderSlotContent } from "./HeaderSlotContext";
import logoWhite from "@/assets/透明底白字.png";

export interface HeaderProps {
  /** 当前登录医生姓名 */
  doctorName: string;
  /** 科室名称 */
  department: string;
}

export function Header({ doctorName: _doctorName, department: _department }: HeaderProps) {
  const slotContent = useHeaderSlotContent();

  return (
    <header className="flex items-center justify-between bg-primary-900 px-8 py-5 shadow-lg">
      <div className="flex items-center gap-4">
        <img src={logoWhite} alt="耳界" className="h-14" />
        <div>
          <h1 className="text-2xl font-bold text-white">
            耳界智能诊室系统
          </h1>
          <p className="text-xs text-primary-200 mt-0.5 opacity-80 uppercase tracking-widest">
            Earmersion Digital Music Therapy Intelligent SOP System
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {slotContent}
        <div className="flex items-center gap-2 bg-primary-800 px-4 py-2 rounded-lg border border-primary-700">
          <span className="h-2.5 w-2.5 rounded-full bg-success-400 animate-pulse" />
          <span className="text-sm font-medium text-white">耳界疗愈大模型就绪</span>
        </div>
      </div>
    </header>
  );
}
