import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Patient } from "@/services/types";
import { useManualPatientForm, type FormData } from "./useManualPatientForm";
import { UserPlus } from "lucide-react";

export interface ManualPatientFormProps {
  onSubmit: (patient: Patient) => void;
  onCancel: () => void;
}

export function ManualPatientForm({ onSubmit, onCancel }: ManualPatientFormProps) {
  const { form, errors, submitting, updateField, handleSubmit } = useManualPatientForm(onSubmit);

  const fields: { key: keyof FormData; label: string; placeholder: string; type?: string }[] = [
    { key: "name", label: "姓名", placeholder: "请输入患者姓名" },
    { key: "insuranceCardNo", label: "医保卡号", placeholder: "请输入医保卡号" },
    { key: "idNumber", label: "身份证号", placeholder: "请输入身份证号" },
    { key: "phone", label: "手机号", placeholder: "请输入手机号", type: "tel" },
    { key: "age", label: "年龄", placeholder: "请输入年龄", type: "number" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key} className="flex flex-col gap-1">
            <Label className="text-xs text-neutral-600 leading-tight">{label}</Label>
            <Input
              type={type ?? "text"}
              value={form[key]}
              onChange={(e) => updateField(key, e.target.value)}
              placeholder={placeholder}
              className="text-xs leading-tight h-7"
              aria-label={label}
            />
            {errors[key] && (
              <span className="text-xs text-error-500">{errors[key]}</span>
            )}
          </div>
        ))}
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-neutral-600 leading-tight">性别</Label>
          <Select value={form.gender} onValueChange={(v) => updateField("gender", v ?? "")}>
            <SelectTrigger className="text-xs leading-tight h-7 w-full" aria-label="性别">
              <SelectValue placeholder="请选择性别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">男</SelectItem>
              <SelectItem value="female">女</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <span className="text-xs text-error-500">{errors.gender}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={submitting}>
          取消
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={submitting}>
          <UserPlus className="h-3 w-3" />
          {submitting ? "创建中..." : "创建并签到"}
        </Button>
      </div>
    </div>
  );
}
