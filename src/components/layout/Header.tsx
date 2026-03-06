import { Stethoscope } from "lucide-react";

export interface HeaderProps {
  /** 当前登录医生姓名 */
  doctorName: string;
  /** 科室名称 */
  department: string;
}

export function Header({ doctorName, department }: HeaderProps) {
  return (
    <header className="flex items-center justify-between bg-white border-b border-neutral-200 px-4 py-2">
      <span className="text-sm font-medium text-neutral-700">
        HIS 医院信息系统
      </span>
      <div className="flex items-center gap-2">
        <Stethoscope className="h-4 w-4 text-primary-500" aria-hidden="true" />
        <span className="text-xs text-neutral-600">{department}</span>
        <span className="text-xs font-medium text-neutral-800">
          {doctorName}
        </span>
      </div>
    </header>
  );
}
