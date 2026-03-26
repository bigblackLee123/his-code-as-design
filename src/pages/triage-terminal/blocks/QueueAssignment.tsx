import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { MaskedText } from "@/components/his/MaskedText";
import { useQueueAssignment } from "./useQueueAssignment";
import type { Patient, VitalSigns } from "@/services/types";
import { Users, CheckCircle, AlertTriangle, RotateCcw } from "lucide-react";

export interface QueueAssignmentProps {
  patient: Patient;
  vitalSigns: VitalSigns;
  onComplete: () => void;
}

const DEPARTMENT_NAME = "中医内科";

export function QueueAssignment({ patient, vitalSigns, onComplete }: QueueAssignmentProps) {
  const { status, waitingCount, maxSize, queueItem, errorMsg, loadQueueInfo, handleAssign } = useQueueAssignment(patient.id);

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary-500" />
          候诊队列分配
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col gap-3">
        {/* Patient summary */}
        <div className="grid grid-cols-2 gap-2 text-xs leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-neutral-500">患者：</span>
            <MaskedText type="name" value={patient.name} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-neutral-500">目标科室：</span>
            <span className="text-neutral-700 font-medium">{DEPARTMENT_NAME}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-neutral-500">收缩压：</span>
            <span className="text-neutral-700">{vitalSigns.systolicBP} mmHg</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-neutral-500">舒张压：</span>
            <span className="text-neutral-700">{vitalSigns.diastolicBP} mmHg</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-neutral-500">心率：</span>
            <span className="text-neutral-700">{vitalSigns.heartRate} 次/分</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-neutral-500">预估等待：</span>
            <span className="text-neutral-700">{waitingCount} 人</span>
          </div>
        </div>

        {/* Queue full warning */}
        {status === "full" && (
          <Alert variant="destructive" className="bg-warning-50 border-warning-200">
            <AlertTriangle className="h-4 w-4 text-warning-500" />
            <AlertTitle className="text-xs font-medium text-warning-700">队列已满</AlertTitle>
            <AlertDescription className="text-xs text-warning-600">
              {DEPARTMENT_NAME}候诊队列已满（{maxSize}人），暂时无法分配，请稍后重试。
            </AlertDescription>
          </Alert>
        )}

        {/* Error alert */}
        {status === "error" && errorMsg && (
          <Alert variant="destructive" className="bg-error-50 border-error-200">
            <AlertTriangle className="h-4 w-4 text-error-500" />
            <AlertTitle className="text-xs font-medium text-error-700">分配失败</AlertTitle>
            <AlertDescription className="text-xs text-error-600">{errorMsg}</AlertDescription>
          </Alert>
        )}

        {/* Assignment success */}
        {status === "assigned" && queueItem && (
          <Alert className="bg-success-50 border-success-200">
            <CheckCircle className="h-4 w-4 text-success-500" />
            <AlertTitle className="text-xs font-medium text-success-700">分配成功</AlertTitle>
            <AlertDescription className="text-xs text-success-600">
              排队序号：<span className="font-mono font-bold text-success-700">{queueItem.queueNumber}</span>
              ，当前等待 {waitingCount} 人
            </AlertDescription>
          </Alert>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          {(status === "preview" || status === "error") && (
            <>
              {status === "error" && (
                <Button variant="outline" size="sm" onClick={loadQueueInfo}>
                  <RotateCcw className="h-3 w-3" />
                  重试
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleAssign}
                disabled={status === "error"}
              >
                <CheckCircle className="h-3 w-3" />
                确认分配
              </Button>
            </>
          )}
          {status === "assigning" && (
            <Button size="sm" disabled>
              分配中...
            </Button>
          )}
          {status === "full" && (
            <Button variant="outline" size="sm" onClick={loadQueueInfo}>
              <RotateCcw className="h-3 w-3" />
              刷新队列
            </Button>
          )}
          {status === "assigned" && (
            <Button size="sm" onClick={onComplete}>
              <CheckCircle className="h-3 w-3" />
              完成，下一位
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
