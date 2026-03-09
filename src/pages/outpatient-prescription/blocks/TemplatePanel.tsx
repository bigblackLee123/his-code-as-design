import { FileText } from "lucide-react";

interface TemplateCategory {
  title: string;
  items: string[];
}

const templateCategories: TemplateCategory[] = [
  {
    title: "入院常规+检验检查",
    items: [
      "doctor-肿瘤科四联复方(药粉)",
      "[基]0.9%氯化钠注射液(50ml)(袋)",
      "3239-入院常规医嘱",
      "3239-入院常规检验",
      "血糖监测+心电图",
    ],
  },
  {
    title: "肿瘤用药",
    items: [
      "3036-艾迪注射液",
      "3036-核苷酸注射液",
      "3036-复方苦参注射液",
      "3036-甘露聚糖肽",
      "3036-参芪化瘀入",
    ],
  },
  {
    title: "对症支持用药",
    items: [
      "3239-复方氨基酸",
      "3239-补液治疗",
      "3239-白蛋白",
      "3239-止吐方案",
    ],
  },
  {
    title: "盐水+糖水+止痛",
    items: [
      "[基]0.9%氯化钠注射液(50ml)(袋)",
      "0.9%氯化钠注射液(100ml)(袋)",
      "0.9%氯化钠注射液(250ml)(袋)",
      "[基]0.9%氯化钠注射液(500ml)(瓶)",
      "吗啡注射液(大)(10ml:90mg)",
    ],
  },
  {
    title: "治疗项目",
    items: [
      "3239-出院医嘱",
      "3036-日死亡",
      "3239-监护医嘱",
      "3239-起搏于术",
    ],
  },
];

export interface TemplatePanelProps {
  onTemplateSelect?: (template: string) => void;
}

export function TemplatePanel({ onTemplateSelect }: TemplatePanelProps) {
  return (
    <div className="bg-white rounded-md border border-neutral-200 p-2">
      <div className="grid grid-cols-5 gap-2">
        {templateCategories.map((category) => (
          <div key={category.title} className="flex flex-col gap-1">
            <div className="text-xs font-medium text-neutral-700 leading-tight px-1 py-0.5 bg-neutral-100 rounded-sm">
              {category.title}
            </div>
            <div className="flex flex-col gap-0.5">
              {category.items.map((item) => (
                <button
                  key={item}
                  onClick={() => onTemplateSelect?.(item)}
                  className="flex items-center gap-1 px-1 py-0.5 text-xs text-primary-600 leading-tight hover:bg-primary-50 rounded-sm transition-colors text-left truncate"
                >
                  <FileText className="h-3 w-3 shrink-0 text-primary-400" aria-hidden="true" />
                  <span className="truncate">{item}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
