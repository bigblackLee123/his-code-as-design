import type { ScaleTemplate } from "../../types";

/**
 * 量表模板数据 — 与后端 seed.sql 对齐
 * 匹兹堡睡眠质量指数(PSQI) 为主量表
 */
export const mockScaleTemplates: ScaleTemplate[] = [
  {
    id: "SCALE001",
    name: "匹兹堡睡眠质量指数(PSQI)",
    description: "评估近一个月的睡眠质量",
    questions: [
      {
        id: "Q001",
        text: "近一个月，您通常几点上床睡觉？",
        type: "text",
        required: true,
      },
      {
        id: "Q002",
        text: "近一个月，您的睡眠质量如何？",
        type: "single-choice",
        required: true,
        options: [
          { value: "0", label: "很好", score: 0 },
          { value: "1", label: "较好", score: 1 },
          { value: "2", label: "较差", score: 2 },
          { value: "3", label: "很差", score: 3 },
        ],
      },
      {
        id: "Q003",
        text: "近一个月，您的日间精神状态如何？",
        type: "slider",
        required: true,
        sliderConfig: { min: 0, max: 10, step: 1 },
      },
    ],
  },
];
