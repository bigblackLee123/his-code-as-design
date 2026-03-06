import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export interface AdminLayoutProps {
  /** 当前登录医生姓名 */
  doctorName: string;
  /** 科室名称 */
  department: string;
  /** 页面内容 */
  children: React.ReactNode;
}

export function AdminLayout({
  doctorName,
  department,
  children,
}: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header doctorName={doctorName} department={department} />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
