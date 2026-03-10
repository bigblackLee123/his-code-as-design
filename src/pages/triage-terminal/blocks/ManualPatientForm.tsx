import { useState } from "react";
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
import { patientService } from "@/services/mock/patientService";
import { UserPlus } from "lucide-react";

export interface ManualPatientFormProps {
  onSubmit: (patient: Patient) => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  insuranceCardNo: string;
  idNumber: string;
  phone: string;
  gender: "male" | "female" | "";
  age: string;
}

const initialForm: FormData = {
  name: "",
  insuranceCardNo: "",
  idNumber: "",
  phone: "",
  gender: "",
  age: "",
};

export function ManualPatientForm({ onSubmit, onCancel }: ManualPatientFormProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "请输入患者姓名";
    if (!form.insuranceCardNo.trim()) newErrors.insuranceCardNo = "请输入医保卡号";
    if (!form.idNumber.trim()) newErrors.idNumber = "请输入身份证号";
    if (!form.phone.trim()) newErrors.phone = "请输入手机号";
    if (!form.gender) newErrors.gender = "请选择性别";
    if (!form.age.trim() || isNaN(Number(form.age)) || Number(form.age) <= 0) {
      newErrors.age = "请输入有效年龄";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const patient = await patientService.create({
        name: form.name.trim(),
        insuranceCardNo: form.insuranceCardNo.trim(),
        idNumber: form.idNumber.trim(),
        phone: form.phone.trim(),
        gender: form.gender as "male" | "female",
        age: Number(form.age),
      });
      onSubmit(patient);
    } finally {
      setSubmitting(false);
    }
  };

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
