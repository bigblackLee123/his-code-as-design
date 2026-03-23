import { useState, useCallback } from "react";
import { patientService } from "@/services";
import type { Patient } from "@/services/types";

export interface FormData {
  name: string;
  insuranceCardNo: string;
  idNumber: string;
  phone: string;
  gender: "male" | "female" | "";
  age: string;
}

const initialForm: FormData = {
  name: "", insuranceCardNo: "", idNumber: "", phone: "", gender: "", age: "",
};

export function useManualPatientForm(onSubmit: (p: Patient) => void) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

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

  const handleSubmit = useCallback(async () => {
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
  }, [form, onSubmit]);

  return { form, errors, submitting, updateField, handleSubmit };
}
