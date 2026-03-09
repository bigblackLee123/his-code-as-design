import { MaskedText } from "@/components/his/MaskedText";
import { Users } from "lucide-react";

export interface PatientInfoBarProps {
  registrationId: string;
  name: string;
  gender: "male" | "female";
  birthDate: string;
  age: number;
  feeCategory: string;
  insuranceCardNo: string;
}

export function PatientInfoBar({
  registrationId,
  name,
  gender,
  birthDate,
  age,
  feeCategory,
  insuranceCardNo,
}: PatientInfoBarProps) {
  return (
    <div className="flex items-center gap-4 bg-primary-50 border border-primary-200 rounded-md px-3 py-1.5">
      <Users className="h-4 w-4 text-primary-500 shrink-0" aria-hidden="true" />
      <div className="flex items-center gap-3 flex-wrap text-xs leading-tight">
        <span className="text-neutral-500">登记号：</span>
        <span className="font-mono text-neutral-800 font-medium">{registrationId}</span>

        <span className="text-neutral-500">姓名：</span>
        <MaskedText type="name" value={name} className="font-semibold text-neutral-800" />

        <span className="text-neutral-500">性别：</span>
        <span className="text-neutral-700">{gender === "male" ? "男" : "女"}</span>

        <span className="text-neutral-500">出生日期：</span>
        <span className="text-neutral-700">{birthDate}</span>

        <span className="text-neutral-500">年龄：</span>
        <span className="text-neutral-700">{age}</span>

        <span className="text-neutral-500">费别：</span>
        <span className="text-neutral-700">{feeCategory}</span>

        <span className="text-neutral-500">医保卡号：</span>
        <MaskedText type="idNumber" value={insuranceCardNo} />
      </div>
    </div>
  );
}
