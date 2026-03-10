import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { OutpatientPrescriptionPage } from "@/pages/outpatient-prescription/OutpatientPrescriptionPage";
import { TriageTerminalPage } from "@/pages/triage-terminal/TriageTerminalPage";
import { DoctorTerminalPage } from "@/pages/doctor-terminal/DoctorTerminalPage";
import { TreatmentTerminalPage } from "@/pages/treatment-terminal/TreatmentTerminalPage";
import { PreviewPage } from "@/pages/preview/PreviewPage";

export default function App() {
  return (
    <BrowserRouter>
      <AdminLayout doctorName="张医生" department="中医内科">
        <Routes>
          <Route path="/" element={<OutpatientPrescriptionPage />} />
          <Route path="/triage" element={<TriageTerminalPage />} />
          <Route path="/doctor" element={<DoctorTerminalPage />} />
          <Route path="/treatment" element={<TreatmentTerminalPage />} />
          <Route path="/preview" element={<PreviewPage />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  );
}
