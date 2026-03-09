import { MaskedText } from "@/components/his/MaskedText";

export interface StatusBarProps {
  userName: string;
  group: string;
  role: string;
  department: string;
}

export function StatusBar({ userName, group, role, department }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between bg-neutral-800 px-3 py-1">
      <div className="flex items-center gap-3 text-xs text-neutral-300">
        <span>用户名称</span>
        <MaskedText type="name" value={userName} className="text-neutral-100" />
        <span>组 {group}</span>
        <span>{role}</span>
      </div>
      <span className="text-xs text-neutral-400">{department}</span>
    </div>
  );
}
