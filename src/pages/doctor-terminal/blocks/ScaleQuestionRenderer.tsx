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
            value={value as string | undefined}
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
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Slider
                min={config.min}
                max={config.max}
                step={config.step}
                value={[current]}
                onValueChange={(val: number | readonly number[]) => {
                  const v = Array.isArray(val) ? val[0] : val;
                  if (v !== undefined) onChange(question.id, v);
                }}
                className="flex-1"
                aria-label={question.text}
              />
              <span className="text-xs font-medium text-neutral-800 w-8 text-center leading-tight">
                {current}
              </span>
            </div>
            <div className="flex justify-between text-xs text-neutral-400 leading-tight">
              <span>{config.min}</span>
              <span>{config.max}</span>
            </div>
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
