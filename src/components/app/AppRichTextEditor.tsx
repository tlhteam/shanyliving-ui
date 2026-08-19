"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const RichTextEditor = dynamic(() => import("@/components/app/AppRichTextEditorClient"), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse rounded-md border border-neutral-300 bg-neutral-50 dark:border-white/15 dark:bg-white/5" />
});

export type AppRichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function AppRichTextEditor({ value, onChange, placeholder, className }: AppRichTextEditorProps) {
  return (
    <div className={cn("app-rich-text overflow-hidden rounded-md border border-neutral-300 dark:border-white/15", className)}>
      <RichTextEditor value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}
