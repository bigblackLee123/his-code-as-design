import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { HeaderSlotProvider } from "./HeaderSlotContext";

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
    <HeaderSlotProvider>
      <div className="flex h-screen flex-col bg-neutral-50">
        <Header doctorName={doctorName} department={department} />
        <div className="flex flex-1 overflow-hidden p-6 gap-6">
          <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
          <main className="flex-1 overflow-auto">
            <div className="rounded-2xl bg-white shadow-sm border border-neutral-200 p-6 min-h-full">{children}</div>
          </main>
        </div>
      </div>
    </HeaderSlotProvider>
  );
}
