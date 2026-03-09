import { Stethoscope } from "lucide-react";
import { MaskedText } from "@/components/his/MaskedText";

export interface SystemHeaderProps {
  systemName: string;
  doctorName: string;
  doctorId: string;
  department: string;
}

export function SystemHeader({ systemName, doctorName, doctorId, department }: SystemHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-primary-800 px-3 py-1.5">
      <div className="flex items-center gap-2">
        <Stethoscope className="h-4 w-4 text-primary-200" aria-hidden="true" />
        <span className="text-xs font-semibold text-white">{systemName}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-primary-100">
        <span>{department}</span>
        <span className="font-mono">{doctorId}</span>
        <MaskedText type="name" value={doctorName} className="text-white" />
      </div>
    </div>
  );
}
