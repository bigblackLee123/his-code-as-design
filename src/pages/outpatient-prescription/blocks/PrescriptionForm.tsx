export interface PrescriptionFormProps {
  onFormChange?: (values: PrescriptionMeta) => void;
}

export interface PrescriptionMeta {
  route: string;
  usage: string;
  frequency: string;
  dosage: string;
  orderType: string;
  department: string;
  doses: number;
}

export function PrescriptionForm({ onFormChange: _onFormChange }: PrescriptionFormProps) {
  return (
    <div className="flex flex-col gap-2 bg-white rounded-md border border-neutral-200 p-2">
      {/* 第一行：用药途径、使用方式、帖药方式、接诊科室 */}
      <div className="grid grid-cols-4 gap-2">
        <div className="flex items-center gap-1">
          <label className="w-16 text-xs text-neutral-600 text-right leading-tight shrink-0">
            用药途径
          </label>
          <div className="flex-1 h-7 rounded border border-neutral-200 bg-neutral-50 px-2 flex items-center text-xs text-neutral-400">
            口服
          </div>
        </div>
        <div className="flex items-center gap-1">
          <label className="w-16 text-xs text-neutral-600 text-right leading-tight shrink-0">
            使用方式
          </label>
          <div className="flex-1 h-7 rounded border border-neutral-200 bg-neutral-50 px-2 flex items-center text-xs text-neutral-400">
            水煎服，日一剂
          </div>
        </div>
        <div className="flex items-center gap-1">
          <label className="w-16 text-xs text-neutral-600 text-right leading-tight shrink-0">
            帖药方式
          </label>
          <div className="flex-1 h-7 rounded border border-neutral-200 bg-neutral-50 px-2 flex items-center text-xs text-neutral-400">
            自煎
          </div>
        </div>
        <div className="flex items-center gap-1">
          <label className="w-16 text-xs text-neutral-600 text-right leading-tight shrink-0">
            接诊科室
          </label>
          <div className="flex-1 h-7 rounded border border-neutral-200 bg-neutral-50 px-2 flex items-center text-xs text-neutral-400">
            [医院]二楼中草药房
          </div>
        </div>
      </div>

      {/* 第二行：用药频次、一次用量、医嘱类型、帖药组数 */}
      <div className="grid grid-cols-4 gap-2">
        <div className="flex items-center gap-1">
          <label className="w-16 text-xs text-neutral-600 text-right leading-tight shrink-0">
            用药频次
          </label>
          <div className="flex-1 h-7 rounded border border-neutral-200 bg-neutral-50 px-2 flex items-center text-xs text-neutral-400">
            每日次
          </div>
        </div>
        <div className="flex items-center gap-1">
          <label className="w-16 text-xs text-neutral-600 text-right leading-tight shrink-0">
            一次用量
          </label>
          <div className="flex-1 h-7 rounded border border-neutral-200 bg-neutral-50 px-2 flex items-center text-xs text-neutral-400">
            200ml
          </div>
        </div>
        <div className="flex items-center gap-1">
          <label className="w-16 text-xs text-neutral-600 text-right leading-tight shrink-0">
            医嘱类型
          </label>
          <div className="flex-1 h-7 rounded border border-neutral-200 bg-neutral-50 px-2 flex items-center text-xs text-neutral-400">
            临时医嘱
          </div>
        </div>
        <div className="flex items-center gap-1">
          <label className="w-16 text-xs text-neutral-600 text-right leading-tight shrink-0">
            帖药组数
          </label>
          <div className="flex-1 h-7 rounded border border-neutral-200 bg-neutral-50 px-2 flex items-center text-xs text-neutral-700 font-medium">
            7
          </div>
        </div>
      </div>

      {/* 第三行：备注 + 费用 */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1">
          <label className="w-16 text-xs text-neutral-600 text-right leading-tight shrink-0">
            备注
          </label>
          <div className="flex-1 h-7 rounded border border-neutral-200 bg-neutral-50 px-2 flex items-center text-xs text-neutral-400">
            —
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <span className="text-xs text-neutral-500">单剂金额</span>
          <span className="text-sm font-semibold text-primary-700 font-mono">42.15</span>
          <span className="text-xs text-neutral-500">金额</span>
          <span className="text-sm font-bold text-error-600 font-mono">295.08</span>
        </div>
      </div>
    </div>
  );
}
