import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { MaskedText } from "@/components/his/MaskedText";
import { ManualPatientForm } from "./ManualPatientForm";
import { usePatientCheckIn } from "./usePatientCheckIn";
import type { Patient } from "@/services/types";
import { CreditCard, AlertTriangle, CheckCircle, UserPlus } from "lucide-react";

export interface PatientCheckInProps {
  onCheckInComplete: (patient: Patient) => void;
}

export function PatientCheckIn({ onCheckInComplete }: PatientCheckInProps) {
  const { mode, patient, error, simulateCardRead, setMode, setPatientFromManual } = usePatientCheckIn();

  const handleConfirm = () => {
    if (patient) onCheckInComplete(patient);
  };

  const handleManualSubmit = (p: Patient) => {
    setPatientFromManual(p);
  };

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary-500" />
          患者签到
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col gap-3">
        {/* Error alert */}
        {error && (
          <Alert variant="destructive" className="bg-error-50 border-error-200">
            <AlertTriangle className="h-4 w-4 text-error-500" />
            <AlertTitle className="text-xs font-medium text-error-700">读卡失败</AlertTitle>
            <AlertDescription className="text-xs text-error-600">{error}</AlertDescription>
          </Alert>
        )}

        {/* Idle / Reading mode: card scan button */}
        {(mode === "idle" || mode === "reading") && (
          <div className="flex flex-col items-center gap-3 py-4">
            {/* size="lg" 用于分诊终端主操作按钮，提高护士站可操作性 */}
            <Button
              size="lg"
              onClick={simulateCardRead}
              disabled={mode === "reading"}
              className="gap-2"
              aria-label="刷医保卡签到"
            >
              <CreditCard className="h-4 w-4" />
              {mode === "reading" ? "读卡中..." : "刷医保卡签到"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMode("manual")}
              disabled={mode === "reading"}
              className="text-xs text-neutral-500"
            >
              <UserPlus className="h-3 w-3" />
              手动输入患者信息
            </Button>
          </div>
        )}

        {/* Manual input mode */}
        {mode === "manual" && (
          <ManualPatientForm
            onSubmit={handleManualSubmit}
            onCancel={() => { setMode("idle"); }}
          />
        )}

        {/* Success mode: show patient info with masking */}
        {mode === "success" && patient && (
          <div className="flex flex-col gap-3">
            <Alert className="bg-success-50 border-success-200">
              <CheckCircle className="h-4 w-4 text-success-500" />
              <AlertTitle className="text-xs font-medium text-success-700">签到成功</AlertTitle>
              <AlertDescription className="text-xs text-success-600">
                患者档案已匹配，请确认信息后继续
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-2 text-xs leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-neutral-500">姓名：</span>
                <MaskedText type="name" value={patient.name} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-neutral-500">性别：</span>
                <span className="text-neutral-700">{patient.gender === "male" ? "男" : "女"}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-neutral-500">年龄：</span>
                <span className="text-neutral-700">{patient.age}岁</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-neutral-500">医保卡号：</span>
                <span className="font-mono text-neutral-700">{patient.insuranceCardNo}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-neutral-500">身份证号：</span>
                <MaskedText type="idNumber" value={patient.idNumber} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-neutral-500">联系电话：</span>
                <MaskedText type="phone" value={patient.phone} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={handleConfirm}>
                <CheckCircle className="h-3 w-3" />
                确认签到
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
