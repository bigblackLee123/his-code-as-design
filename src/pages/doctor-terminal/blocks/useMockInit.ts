import { useEffect } from "react";
import { therapyService, patientService } from "@/services";
import type { Patient, TherapyProject } from "@/services/types";

const useMock = import.meta.env.VITE_USE_MOCK === "true";

const MOCK_PATIENT: Patient = {
  id: "P003",
  name: "王建国",
  gender: "male",
  age: 72,
  idNumber: "440103195207203456",
  phone: "15012349876",
  insuranceCardNo: "YB20240003",
  status: "consulting",
  createdAt: "2024-01-15T09:00:00Z",
};

export function useMockInit(
  onPatient: (p: Patient) => void,
  onProjects: (p: TherapyProject[]) => void,
) {
  useEffect(() => {
    if (!useMock) return;
    patientService.saveVitalSigns(MOCK_PATIENT.id, {
      systolicBP: 145, diastolicBP: 92, heartRate: 82,
      recordedAt: new Date().toISOString(), recordedBy: "分诊护士",
    });
    onPatient(MOCK_PATIENT);
    therapyService.getProjects().then((projects) => {
      if (projects.length > 0) onProjects(projects.slice(0, 2));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
