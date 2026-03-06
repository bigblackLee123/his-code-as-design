import { cn } from "@/lib/utils";
import { MaskedText } from "@/components/his/MaskedText";
import { BedDouble, AlertTriangle, Users } from "lucide-react";

/** 患者状态类型 */
type PatientStatus = "admitted" | "inHospital" | "discharged" | "critical";

/** 过敏信息 */
interface AllergyInfo {
  name: string;
  severity: "high" | "medium" | "low";
}

export interface PatientInfoCardProps {
  /** 患者姓名 */
  name: string;
  /** 性别 */
  gender: "male" | "female";
  /** 年龄 */
  age: number;
  /** 床位号 */
  bedNumber: string;
  /** 住院号 */
  admissionId: string;
  /** 身份证号 */
  idNumber: string;
  /** 联系电话 */
  phone: string;
  /** 患者状态 */
  status: PatientStatus;
  /** 过敏史 */
  allergies?: AllergyInfo[];
  /** 自定义样式 */
  className?: string;
}

const statusConfig: Record<
  PatientStatus,
  { label: string; bgClass: string; textClass: string; pulse?: boolean }
> = {
  admitted: {
    label: "入院",
    bgClass: "bg-his-admitted/10",
    textClass: "text-his-admitted",
  },
  inHospital: {
    label: "在院",
    bgClass: "bg-his-inHospital/10",
    textClass: "text-his-inHospital",
  },
  discharged: {
    label: "出院",
    bgClass: "bg-his-discharged/10",
    textClass: "text-his-discharged",
  },
  critical: {
    label: "危急",
    bgClass: "bg-his-critical/10",
    textClass: "text-his-critical",
    pulse: true,
  },
};

export function PatientInfoCard({
  name,
  gender,
  age,
  bedNumber,
  admissionId,
  idNumber,
  phone,
  status,
  allergies = [],
  className,
}: PatientInfoCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <div
      className={cn(
        "rounded-lg shadow-sm bg-white p-3 flex flex-col gap-2",
        className
      )}
    >
      {/* 顶部：姓名 + 状态 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary-500" />
          <MaskedText
            type="name"
            value={name}
            className="text-sm font-semibold text-neutral-800"
          />
          <span className="text-xs text-neutral-500">
            {gender === "male" ? "男" : "女"} · {age}岁
          </span>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium",
            statusInfo.bgClass,
            statusInfo.textClass,
            statusInfo.pulse && "animate-pulse"
          )}
        >
          {statusInfo.pulse && (
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
          )}
          {statusInfo.label}
        </span>
      </div>

      {/* 中部：基本信息 */}
      <div className="grid grid-cols-2 gap-1 text-xs leading-tight">
        <div className="flex items-center gap-1">
          <BedDouble className="h-3 w-3 text-neutral-400" aria-hidden="true" />
          <span className="text-neutral-500">床位：</span>
          <span className="text-neutral-700 font-medium">{bedNumber}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-neutral-500">住院号：</span>
          <span className="font-mono text-neutral-700">{admissionId}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-neutral-500">身份证：</span>
          <MaskedText type="idNumber" value={idNumber} />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-neutral-500">电话：</span>
          <MaskedText type="phone" value={phone} />
        </div>
      </div>

      {/* 底部：过敏史 */}
      {allergies.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          <AlertTriangle
            className="h-3 w-3 text-error-500"
            aria-hidden="true"
          />
          <span className="text-xs text-error-700 font-medium">过敏：</span>
          {allergies.map((allergy) => (
            <span
              key={allergy.name}
              className={cn(
                "rounded-sm px-1.5 py-0.5 text-xs font-medium",
                allergy.severity === "high"
                  ? "bg-error-50 text-error-700"
                  : allergy.severity === "medium"
                    ? "bg-warning-50 text-warning-700"
                    : "bg-neutral-100 text-neutral-600"
              )}
            >
              {allergy.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
