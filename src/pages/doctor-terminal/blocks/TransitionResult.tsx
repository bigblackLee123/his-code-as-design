import { CheckCircle, AlertTriangle, RotateCcw } from "lucide-react";

export interface TransitionResultProps {
  type: "success" | "error";
  queueNumber?: number;
  errorMsg?: string;
  onComplete: () => void;
  onRetry: () => void;
}

export function TransitionResult({
  type,
  queueNumber,
  errorMsg,
  onComplete,
  onRetry,
}: TransitionResultProps) {
  if (type === "success") {
    return (
      <div className="flex flex-col items-center gap-3 animate-in fade-in">
        <div className="rounded-full bg-success-100 p-4">
          <CheckCircle className="h-10 w-10 text-success-500" aria-hidden="true" />
        </div>
        <span className="text-sm font-bold text-success-700 leading-tight">流转成功</span>
        {queueNumber !== undefined && (
          <span className="text-xs text-neutral-500 leading-tight">
            排队序号：<span className="font-mono font-medium text-primary-600">{queueNumber}</span>
          </span>
        )}
        <button
          type="button"
          onClick={onComplete}
          className="flex items-center gap-1 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm px-6 py-3 mt-4 transition-colors"
        >
          返回候诊队列
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-full bg-error-100 p-4">
        <AlertTriangle className="h-10 w-10 text-error-500" aria-hidden="true" />
      </div>
      <span className="text-sm font-bold text-error-700 leading-tight">流转失败</span>
      <span className="text-xs text-neutral-500 leading-tight">{errorMsg}</span>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-1 rounded-full bg-error-50 px-4 py-2 text-xs font-medium text-error-700 hover:bg-error-100 transition-colors"
      >
        <RotateCcw className="h-3 w-3" />
        重试
      </button>
    </div>
  );
}
