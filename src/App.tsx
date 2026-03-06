import { AdminLayout } from "@/components/layout/AdminLayout";
import { PatientInfoCard } from "@/components/his/PatientInfoCard";

export default function App() {
  return (
    <AdminLayout doctorName="[name]" department="内科">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-neutral-800">
          工作站首页
        </h1>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          <PatientInfoCard
            name="张三丰"
            gender="male"
            age={68}
            bedNumber="A-301"
            admissionId="ZY20240115001"
            idNumber="110101195601011234"
            phone="13812345678"
            status="inHospital"
            allergies={[
              { name: "青霉素", severity: "high" },
              { name: "磺胺类", severity: "medium" },
            ]}
          />
          <PatientInfoCard
            name="李四"
            gender="female"
            age={45}
            bedNumber="A-302"
            admissionId="ZY20240115002"
            idNumber="310101197901025678"
            phone="13987654321"
            status="critical"
            allergies={[{ name: "碘造影剂", severity: "high" }]}
          />
          <PatientInfoCard
            name="王五"
            gender="male"
            age={32}
            bedNumber="A-303"
            admissionId="ZY20240115003"
            idNumber="440101199201039012"
            phone="15012348765"
            status="admitted"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
