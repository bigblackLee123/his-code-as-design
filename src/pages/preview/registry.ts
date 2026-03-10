import type { ReactNode } from "react";

/** 单个 Block 预览条目 */
export interface BlockPreviewEntry {
  /** Block 名称 */
  name: string;
  /** 简要说明 */
  description: string;
  /** 渲染函数，返回带 mock props 的 Block 组件 */
  render: () => ReactNode;
}

/** 页面预览配置 */
export interface PagePreviewConfig {
  /** 页面标识 */
  id: string;
  /** 页面中文名 */
  title: string;
  /** 页面路由（正式页面） */
  route: string;
  /** 该页面下所有 Block 预览 */
  blocks: BlockPreviewEntry[];
}

/** 全局预览注册表 */
const previewRegistry: PagePreviewConfig[] = [];

export function registerPreview(config: PagePreviewConfig) {
  previewRegistry.push(config);
}

export function getPreviewRegistry(): PagePreviewConfig[] {
  return previewRegistry;
}
