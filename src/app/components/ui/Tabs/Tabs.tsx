"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/cn";
import styles from "./Tabs.module.css";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

function TabsRoot({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
}: PropsWithChildren<TabsProps>) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;

  const value = isControlled ? controlledValue : uncontrolledValue;

  const contextValue = useMemo(() => ({
    value,
    setValue: (next: string) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
  }), [isControlled, onValueChange, value]);

  return <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>;
}

function TabsList({ children }: PropsWithChildren) {
  return (
    <div role="tablist" className={styles.list}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

function TabsTrigger({ value, children }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within Tabs");
  }

  const isActive = context.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={cn(styles.trigger, isActive && styles.triggerActive)}
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

function TabsContent({ value, children }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within Tabs");
  }

  if (context.value !== value) {
    return null;
  }

  return (
    <div role="tabpanel" className={styles.content}>
      {children}
    </div>
  );
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
