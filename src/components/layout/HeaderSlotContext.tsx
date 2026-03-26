import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface HeaderSlotContextValue {
  slotContent: ReactNode | null;
  setSlotContent: (content: ReactNode | null) => void;
}

const HeaderSlotContext = createContext<HeaderSlotContextValue>({
  slotContent: null,
  setSlotContent: () => {},
});

export function HeaderSlotProvider({ children }: { children: ReactNode }) {
  const [slotContent, setSlotContent] = useState<ReactNode | null>(null);
  return (
    <HeaderSlotContext.Provider value={{ slotContent, setSlotContent }}>
      {children}
    </HeaderSlotContext.Provider>
  );
}

/** Header 消费 slot 内容 */
export function useHeaderSlotContent(): ReactNode | null {
  return useContext(HeaderSlotContext).slotContent;
}

/** 页面设置 slot 内容，卸载时自动清空 */
export function useHeaderSlot(content: ReactNode) {
  const { setSlotContent } = useContext(HeaderSlotContext);

  useEffect(() => {
    setSlotContent(content);
    return () => setSlotContent(null);
  }, [content, setSlotContent]);
}
