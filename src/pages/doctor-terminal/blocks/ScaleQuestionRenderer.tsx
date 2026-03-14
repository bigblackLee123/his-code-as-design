import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ScaleQuestion } from "@/services/types";
import { cn } from "@/lib/utils";

export interface ScaleQuestionRendererProps {
  question: ScaleQuestion;
  value: string | string[] | number | undefined;
  onChange: (questionId: string, value: string | string[] | number) => void;
  hasError: boolean;
}

export function ScaleQuestionRenderer({
  question,
  value,
  onChange,
  hasError,
}: ScaleQuestionRendererProps) {
  const renderInput = () => {
    switch (question.type) {
      case "single-choice":
        return (
          <RadioGroup
            value={(value as string | undefined) ?? ""}
            onValueChange={(val: string) => onChange(question.id, val)}
            className="flex flex-col gap-1.5"
          >
            {question.options?.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} id={`${question.id}-${opt.value}`} />
                <Label
                  htmlFor={`${question.id}-${opt.value}`}
                  className="text-xs leading-tight text-neutral-700 cursor-pointer"
                >
                  {opt.label}
                  {opt.score !== undefined && (
                    <span className="text-neutral-400 ml-1">({opt.score}分)</span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "multi-choice": {
        const selected = (value as string[] | undefined) ?? [];
        return (
          <div className="flex flex-col gap-1.5">
            {question.options?.map((opt) => {
              const checked = selected.includes(opt.value);
              return (
                <div key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`${question.id}-${opt.value}`}
                    checked={checked}
                    onCheckedChange={(c: boolean) => {
                      const next = c
                        ? [...selected, opt.value]
                        : selected.filter((v) => v !== opt.value);
                      onChange(question.id, next);
                    }}
                  />
                  <Label
                    htmlFor={`${question.id}-${opt.value}`}
                    className="text-xs leading-tight text-neutral-700 cursor-pointer"
                  >
                    {opt.label}
                    {opt.score !== undefined && (
                      <span className="text-neutral-400 ml-1">({opt.score}分)</span>
                    )}
                  </Label>
                </div>
              );
            })}
          </div>
        );
      }

      case "slider": {
        const config = question.sliderConfig ?? { min: 0, max: 10, step: 1 };
        const current = (value as number | undefined) ?? config.min;
        const tickCount = Math.floor((config.max - config.min) / config.step) + 1;
        const ticks = Array.from({ length: tickCount }, (_, i) => config.min + i * config.step);
        return (
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <Slider
                min={config.min}
                max={config.max}
                step={config.step}
                value={[current]}
                onValueChange={(val: number | readonly number[]) => {
                  const v = Array.isArray(val) ? val[0] : val;
                  if (v !== undefined) onChange(question.id, v);
                }}
                className="w-full [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:rounded-full [&_[data-slot=slider-track]]:bg-primary-100 [&_[data-slot=slider-range]]:bg-primary-500 [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-primary-500"
                aria-label={question.text}
              />
              {/* Tick marks — inset by thumb radius (size-4/2=8px) to match edge-aligned thumb */}
              <div className="relative h-8 mx-2">
                {ticks.map((tick) => {
                  const pct = config.max === config.min ? 0 : ((tick - config.min) / (config.max - config.min)) * 100;
                  return (
                    <div
                      key={tick}
                      className="absolute flex flex-col items-center gap-0.5 -translate-x-1/2"
                      style={{ left: `${pct}%` }}
                    >
                      <div className={cn(
                        "w-px h-1.5",
                        tick <= current ? "bg-primary-400" : "bg-neutral-300"
                      )} />
                      <span className={cn(
                        "text-xs leading-tight",
                        tick <= current ? "text-primary-500" : "text-neutral-400"
                      )}>
                        {tick}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <Input
              type="number"
              min={config.min}
              max={config.max}
              step={config.step}
              value={current}
              onChange={(e) => {
                const raw = Number(e.target.value);
                if (Number.isNaN(raw)) return;
                const clamped = Math.min(config.max, Math.max(config.min, raw));
                onChange(question.id, clamped);
              }}
              className="w-14 h-7 text-xs text-center leading-tight shrink-0 self-start"
              aria-label={`${question.text} 数值输入`}
            />
          </div>
        );
      }

      case "text":
        return (
          <Input
            value={(value as string | undefined) ?? ""}
            onChange={(e) => onChange(question.id, e.target.value)}
            placeholder="请输入"
            className="text-xs leading-tight h-7"
            aria-label={question.text}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      id={`question-${question.id}`}
      className={cn(
        "flex flex-col gap-1.5 rounded-md p-2 transition-colors",
        hasError && "bg-error-50 ring-1 ring-error-300"
      )}
    >
      <div className="flex items-start gap-1">
        <span className="text-xs font-medium text-neutral-800 leading-tight">
          {question.text}
        </span>
        {question.required && (
          <span className="text-error-500 text-xs leading-tight">*</span>
        )}
      </div>
      {hasError && (
        <span className="text-xs text-error-600 leading-tight">此题为必填项</span>
      )}
      {renderInput()}
    </div>
  );
}
