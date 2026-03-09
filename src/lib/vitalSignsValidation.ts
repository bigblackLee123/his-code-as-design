import type { VitalSigns } from "@/services/types";
import { VITAL_SIGNS_RULES, VITAL_SIGNS_ALERT_THRESHOLDS } from "@/services/types";

export interface VitalSignsValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  alerts: Record<string, boolean>;
}

const VITAL_FIELDS = ["systolicBP", "diastolicBP", "heartRate"] as const;

/** 校验生理数据范围，同时检测异常阈值 */
export function validateVitalSigns(
  vitals: Partial<VitalSigns>
): VitalSignsValidationResult {
  const errors: Record<string, string> = {};
  const alerts: Record<string, boolean> = {};

  for (const field of VITAL_FIELDS) {
    const value = vitals[field];
    const rule = VITAL_SIGNS_RULES[field];
    const threshold = VITAL_SIGNS_ALERT_THRESHOLDS[field];

    if (value === undefined || value === null) {
      alerts[field] = false;
      continue;
    }

    if (typeof value !== "number" || isNaN(value)) {
      errors[field] = `${rule.label}必须为有效数字`;
      alerts[field] = false;
      continue;
    }

    if (value < rule.min || value > rule.max) {
      errors[field] = `${rule.label}应在 ${rule.min}-${rule.max} ${rule.unit} 范围内`;
      alerts[field] = false;
      continue;
    }

    alerts[field] = value > threshold;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    alerts,
  };
}

/** 判断生理数据是否存在任一异常值 */
export function hasVitalSignsAlert(vitals: VitalSigns): boolean {
  return VITAL_FIELDS.some(
    (field) => vitals[field] > VITAL_SIGNS_ALERT_THRESHOLDS[field]
  );
}

/** 计算治疗前后生理数据变化百分比（绝对值） */
export function calculateVitalSignsChange(
  pre: VitalSigns,
  post: VitalSigns
): Record<string, number> {
  const result: Record<string, number> = {};

  for (const field of VITAL_FIELDS) {
    const preVal = pre[field];
    const postVal = post[field];

    if (preVal === 0) {
      result[field] = 0;
      continue;
    }

    result[field] = Math.abs(((postVal - preVal) / preVal) * 100);
  }

  return result;
}
