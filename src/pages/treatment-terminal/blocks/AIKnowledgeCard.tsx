import { BookOpen, Sparkles } from "lucide-react";

const KNOWLEDGE_ITEMS = [
  "《黄帝内经》音乐五脏生克",
  "现代神经科学: RAS 步态耦合机制",
  "耳界 3D 音场对 Alpha 波的影响研究",
  "临床循环运动疗法音乐干预 Meta 分析",
];

export function AIKnowledgeCard() {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-primary-900 p-3">
      <div className="flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-primary-300" aria-hidden="true" />
        <span className="text-xs font-semibold text-primary-200 leading-tight">
          AI 知识库匹配
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {KNOWLEDGE_ITEMS.map((item) => (
          <div
            key={item}
            className="flex items-start gap-1.5 rounded-lg bg-primary-800 px-2 py-1.5"
          >
            <BookOpen
              className="h-3 w-3 text-primary-400 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span className="text-xs text-primary-100 leading-tight">{item}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-primary-500 leading-tight mt-1">
        * 耳界疗愈大模型深度体验综合诊疗已启动…
      </p>
    </div>
  );
}
