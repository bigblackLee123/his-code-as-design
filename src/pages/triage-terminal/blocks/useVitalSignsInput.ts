import { useState, useCallback } from "react";
import { validateVitalSigns } from "@/lib/vitalSignsValidation";
import { patientService } from "@/services";
import type { VitalSigns } from "@/services/types";

type VitalField = "systolicBP" | "diastolicBP" | "heartRate";

export function useVitalSignsInput(patientId: string, onSave: (v: VitalSigns) => void) {
  const [values, setValues] = useState<Record<VitalField, string>>({
    systolicBP: "", diastolicBP: "", heartRate: "",
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
      recordedBy: "分诊护士",
    };
    await patientService.saveVitalSigns(patientId, vitals);
    setSaving(false);
    onSave(vitals);
  }, [canSave, values, patientId, onSave]);

  return { values, validation, saving, canSave, handleChange, handleSave };
}
