import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { TriageTerminalPage } from "@/pages/triage-terminal/TriageTerminalPage";
import { DoctorTerminalPage } from "@/pages/doctor-terminal/DoctorTerminalPage";
import { TreatmentTerminalPage } from "@/pages/treatment-terminal/TreatmentTerminalPage";
import { MiddleTerminalPage } from "@/pages/middle-terminal/MiddleTerminalPage";
import { PreviewPage } from "@/pages/preview/PreviewPage";

export default function App() {
  return (
    <BrowserRouter>
      <AdminLayout doctorName="张医生" department="音乐疗愈中心">
        <Routes>
          <Route path="/" element={<Navigate to="/triage" replace />} />
          <Route path="/triage" element={<TriageTerminalPage />} />
          <Route path="/doctor" element={<DoctorTerminalPage />} />
          <Route path="/treatment" element={<TreatmentTerminalPage />} />
          <Route path="/middle" element={<MiddleTerminalPage />} />
          <Route path="/preview" element={<PreviewPage />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  );
}
