import { useState, useRef, useEffect, useCallback } from "react";
import { BookOpen, ChevronUp, ChevronDown, Pause, Play } from "lucide-react";

export interface GuidanceScriptCardProps {
  script: string | null;
  projectName: string;
}

function splitSentences(text: string): string[] {
  // 先把字面量 \n 和真实换行都统一处理
  const cleaned = text.replace(/\\n/g, "\n");
  return cleaned
    .split(/[。\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function GuidanceScriptCard({ script, projectName }: GuidanceScriptCardProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrolling, setScrolling] = useState(true);
  const activeRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sentences = script && script !== "/" ? splitSentences(script) : [];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 自动滚动：每 6 秒下一句
  useEffect(() => {
    if (!scrolling || sentences.length === 0) return clearTimer();
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i < sentences.length - 1 ? i + 1 : i));
    }, 6000);
    return clearTimer;
  }, [scrolling, sentences.length, clearTimer]);

  // 滚动到当前句
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeIdx]);

  if (sentences.length === 0) {
    return (
      <div className="rounded-xl bg-neutral-900 p-6 flex flex-col items-center justify-center gap-2 h-80">
        <BookOpen className="h-6 w-6 text-neutral-600" aria-hidden="true" />
        <span className="text-xs text-neutral-500">「{projectName}」暂无引导词</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-neutral-900 flex flex-col h-80 overflow-hidden">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-primary-400" aria-hidden="true" />
          <span className="text-xs font-medium text-neutral-400 leading-tight">
            {projectName}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
            disabled={activeIdx === 0}
            className="text-neutral-500 hover:text-white disabled:opacity-30 p-1 transition-colors"
            aria-label="上一句"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setScrolling((s) => !s)}
            className="text-neutral-500 hover:text-white p-1 transition-colors"
            aria-label={scrolling ? "暂停" : "继续"}
          >
            {scrolling ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setActiveIdx((i) => Math.min(sentences.length - 1, i + 1))}
            disabled={activeIdx >= sentences.length - 1}
            className="text-neutral-500 hover:text-white disabled:opacity-30 p-1 transition-colors"
            aria-label="下一句"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <span className="text-xs text-neutral-600 font-mono ml-2">
            {activeIdx + 1}/{sentences.length}
          </span>
        </div>
      </div>

      {/* 提词区：渐变遮罩 + 滚动 */}
      <div className="relative flex-1 min-h-0">
        {/* 顶部渐变遮罩 */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-neutral-900 to-transparent z-10 pointer-events-none" />
        {/* 底部渐变遮罩 */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-neutral-900 to-transparent z-10 pointer-events-none" />

        <div className="h-full overflow-y-auto px-4 py-6">
          {sentences.map((sentence, idx) => {
            const isActive = idx === activeIdx;
            const distance = Math.abs(idx - activeIdx);
            const opacity =
              distance === 0 ? "opacity-100" :
              distance === 1 ? "opacity-40" :
              distance === 2 ? "opacity-20" : "opacity-10";

            return (
              <span
                key={idx}
                ref={isActive ? activeRef : undefined}
                className={`block py-1.5 transition-all duration-500 leading-relaxed ${opacity} ${
                  isActive
                    ? "text-white text-base font-medium"
                    : "text-neutral-400 text-sm"
                }`}
              >
                {sentence}。
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
