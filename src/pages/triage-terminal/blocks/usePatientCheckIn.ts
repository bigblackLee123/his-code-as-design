import { useState, useCallback } from "react";
import { patientService } from "@/services";
import type { Patient } from "@/services/types";

type Mode = "idle" | "reading" | "success" | "manual";

export function usePatientCheckIn() {
  const [mode, setMode] = useState<Mode>("idle");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

  const simulateCardRead = useCallback(async () => {
    setMode("reading");
    setError(null);

    await new Promise((r) => setTimeout(r, 1200));

    if (Math.random() < 0.3) {
      setError("刷卡失败：读卡器未响应，请重试或手动输入患者信息");
      setMode("manual");
      return;
    }

    const mockCardNo = "YB2024001";
    let found = await patientService.getByInsuranceCard(mockCardNo);

    if (!found) {
      found = await patientService.create({
        name: "张三",
        gender: "male",
        age: 45,
        idNumber: "310101197801010011",
        phone: "13800138000",
        insuranceCardNo: mockCardNo,
      });
    } else {
      if ("checkIn" in patientService) {
        await (patientService as { checkIn: (id: string) => Promise<void> }).checkIn(found.id);
      }
      found = { ...found, status: "checked-in" };
    }

    setPatient(found);
    setMode("success");
  }, []);

  const setPatientFromManual = useCallback((p: Patient) => {
    setPatient(p);
    setError(null);
    setMode("success");
  }, []);

  return { mode, patient, error, simulateCardRead, setMode, setPatientFromManual };
}
