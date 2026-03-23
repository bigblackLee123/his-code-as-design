import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientStatusSearch } from "./blocks/PatientStatusSearch";
import { RegionQueueBoard } from "./blocks/RegionQueueBoard";
import { Monitor } from "lucide-react";

export function MiddleTerminalPage() {
  return (
    <div className="flex flex-col gap-2 h-full bg-neutral-50 p-2 overflow-auto">
      <Card className="rounded-lg shadow-sm">
        <CardHeader className="p-2">
          <CardTitle className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary-500" />
            中枢终端 — 患者状态查询 &amp; 区域排号
          </CardTitle>
        </CardHeader>
      </Card>

      <PatientStatusSearch />
      <RegionQueueBoard />
    </div>
  );
}
