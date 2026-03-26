import { useState, useCallback } from "react";
import { validateVitalSigns, calculateVitalSignsChange } from "@/lib/vitalSignsValidation";
import type { VitalSigns } from "@/services/types";

type VitalField = "systolicBP" | "diastolicBP" | "heartRate";

export function usePostVitals(preVitals: VitalSigns, onSave: (v: VitalSigns) => void) {
  const [values, setValues] = useState<Record<VitalField, string>>({
    systolicBP: "",
    diastolicBP: "",
    heartRate: "",
  });
  const [saving, setSaving] = useState(false);

  const parsedVitals: Partial<VitalSigns> = {
    systolicBP: values.systolicBP ? Number(values.systolicBP) : undefined,
    diastolicBP: values.diastolicBP ? Number(values.diastolicBP) : undefined,
    heartRate: values.heartRate ? Number(values.heartRate) : undefined,
  };

  const validation = validateVitalSigns(parsedVitals);
  const allFilled = values.systolicBP !== "" && values.diastolicBP !== "" && values.heartRate !== "";
  const canSave = allFilled && validation.valid;

  const postVitalsComplete: VitalSigns | null = canSave
    ? { systolicBP: Number(values.systolicBP), diastolicBP: Number(values.diastolicBP), heartRate: Number(values.heartRate), recordedAt: "", recordedBy: "" }
    : null;

  const changeMap = postVitalsComplete ? calculateVitalSignsChange(preVitals, postVitalsComplete) : null;

  const handleChange = useCallback((field: VitalField, raw: string) => {
    const cleaned = raw.replace(/[^\d]/g, "");
    setValues((prev) => ({ ...prev, [field]: cleaned }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!canSave) return;
    setSaving(true);
    const vitals: VitalSigns = {
      systolicBP: Number(values.systolicBP),
      diastolicBP: Number(values.diastolicBP),
      heartRate: Number(values.heartRate),
      recordedAt: new Date().toISOString(),
      recordedBy: "治疗护士",
    };
    setSaving(false);
    onSave(vitals);
  }, [canSave, values, onSave]);

  return { values, validation, saving, canSave, changeMap, handleChange, handleSave };
}
