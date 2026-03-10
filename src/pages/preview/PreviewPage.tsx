import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPreviewRegistry } from "./registry";
import { Eye, Layers } from "lucide-react";

/* 注册所有预览配置（副作用导入） */
import "./configs/triage";
import "./configs/doctor";
import "./configs/treatment";

export function PreviewPage() {
  const registry = getPreviewRegistry();
  const [activePageId, setActivePageId] = useState<string>(registry[0]?.id ?? "");
  const [activeBlockIdx, setActiveBlockIdx] = useState<number | null>(null);

  const activePage = registry.find((p) => p.id === activePageId);

  return (
    <div className="flex h-full bg-neutral-50 gap-2 p-2">
      {/* Left: page & block selector */}
      <div className="w-56 shrink-0 flex flex-col gap-2">
        <Card className="rounded-lg shadow-sm">
          <CardHeader className="p-2">
            <CardTitle className="text-xs font-semibold flex items-center gap-1">
              <Layers className="h-3 w-3 text-primary-500" aria-hidden="true" />
              页面列表
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 flex flex-col gap-1">
            {registry.map((page) => (
              <Button
                key={page.id}
                variant={page.id === activePageId ? "default" : "ghost"}
                size="sm"
                className="justify-start text-xs"
                onClick={() => { setActivePageId(page.id); setActiveBlockIdx(null); }}
                aria-label={`切换到${page.title}预览`}
              >
                {page.title}
                <Badge className="ml-auto bg-neutral-200 text-neutral-600 text-xs">
                  {page.blocks.length}
                </Badge>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Block list for active page */}
        {activePage && (
          <Card className="rounded-lg shadow-sm flex-1 overflow-auto">
            <CardHeader className="p-2">
              <CardTitle className="text-xs font-semibold flex items-center gap-1">
                <Eye className="h-3 w-3 text-primary-500" aria-hidden="true" />
                {activePage.title} Blocks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex flex-col gap-1">
              <Button
                variant={activeBlockIdx === null ? "secondary" : "ghost"}
                size="sm"
                className="justify-start text-xs"
                onClick={() => setActiveBlockIdx(null)}
                aria-label="显示全部 Block"
              >
                全部展示
              </Button>
              {activePage.blocks.map((block, idx) => (
                <Button
                  key={block.name}
                  variant={activeBlockIdx === idx ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start text-xs"
                  onClick={() => setActiveBlockIdx(idx)}
                  aria-label={`预览 ${block.name}`}
                >
                  {block.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right: block preview area */}
      <div className="flex-1 overflow-auto flex flex-col gap-3 p-2">
        {activePage && (activeBlockIdx === null
          ? activePage.blocks.map((block) => (
              <Card key={block.name} className="rounded-lg shadow-sm">
                <CardHeader className="p-2">
                  <CardTitle className="text-xs font-medium text-neutral-800">
                    {block.name}
                  </CardTitle>
                  <p className="text-xs text-neutral-500 leading-tight">{block.description}</p>
                </CardHeader>
                <CardContent className="p-2">
                  {block.render()}
                </CardContent>
              </Card>
            ))
          : (() => {
              const block = activePage.blocks[activeBlockIdx!];
              if (!block) return null;
              return (
                <Card className="rounded-lg shadow-sm">
                  <CardHeader className="p-2">
                    <CardTitle className="text-xs font-medium text-neutral-800">
                      {block.name}
                    </CardTitle>
                    <p className="text-xs text-neutral-500 leading-tight">{block.description}</p>
                  </CardHeader>
                  <CardContent className="p-2">
                    {block.render()}
                  </CardContent>
                </Card>
              );
            })()
        )}
      </div>
    </div>
  );
}
