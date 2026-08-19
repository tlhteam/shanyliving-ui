"use client";

import { useMemo, useRef, useState } from "react";
import { Bold, Eye, Heading2, Italic, Link2, List, ListOrdered, Pencil, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppRichTextEditorProps } from "@/components/app/AppRichTextEditor";

type Action = {
  key: string;
  label: string;
  icon: typeof Bold;
  wrap?: [string, string];
  prefix?: string;
};

const actions: Action[] = [
  { key: "bold", label: "Bold", icon: Bold, wrap: ["**", "**"] },
  { key: "italic", label: "Italic", icon: Italic, wrap: ["_", "_"] },
  { key: "heading", label: "Heading", icon: Heading2, prefix: "## " },
  { key: "quote", label: "Quote", icon: Quote, prefix: "> " },
  { key: "bullet", label: "Bulleted list", icon: List, prefix: "- " },
  { key: "ordered", label: "Numbered list", icon: ListOrdered, prefix: "1. " },
  { key: "link", label: "Link", icon: Link2, wrap: ["[", "](https://)"] }
];

function renderMarkdown(markdown: string) {
  const escaped = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const blocks = escaped.split(/\n{2,}/).map((block) => {
    const lines = block.split("\n");

    if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
      const items = lines.map((line) => `<li>${line.replace(/^\s*[-*]\s+/, "")}</li>`).join("");

      return `<ul>${items}</ul>`;
    }

    if (lines.every((line) => /^\s*\d+\.\s+/.test(line))) {
      const items = lines.map((line) => `<li>${line.replace(/^\s*\d+\.\s+/, "")}</li>`).join("");

      return `<ol>${items}</ol>`;
    }

    if (/^\s*&gt;\s+/.test(block)) {
      return `<blockquote>${block.replace(/^\s*&gt;\s+/gm, "")}</blockquote>`;
    }

    const heading = block.match(/^(#{1,4})\s+(.*)$/);

    if (heading) {
      const level = heading[1].length + 1;

      return `<h${level}>${heading[2]}</h${level}>`;
    }

    return `<p>${block.replace(/\n/g, "<br />")}</p>`;
  });

  return blocks
    .join("")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

export default function AppRichTextEditorClient({ value, onChange, placeholder }: AppRichTextEditorProps) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  const html = useMemo(() => renderMarkdown(value ?? ""), [value]);

  const apply = (action: Action) => {
    const element = textarea.current;

    if (!element) {
      return;
    }

    const start = element.selectionStart;
    const end = element.selectionEnd;
    const current = value ?? "";
    const selected = current.slice(start, end);

    if (action.wrap) {
      const [open, close] = action.wrap;
      const next = current.slice(0, start) + open + (selected || action.key === "link" ? selected || "label" : "text") + close + current.slice(end);
      onChange(next);
      window.requestAnimationFrame(() => {
        element.focus();
        element.setSelectionRange(start + open.length, start + open.length + (selected || "text").length);
      });

      return;
    }

    const lineStart = current.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
    const next = current.slice(0, lineStart) + action.prefix + current.slice(lineStart);
    onChange(next);
    window.requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(start + (action.prefix?.length ?? 0), end + (action.prefix?.length ?? 0));
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-neutral-50 p-1.5 dark:border-white/10 dark:bg-white/5">
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            aria-label={action.label}
            title={action.label}
            disabled={preview}
            onClick={() => apply(action)}
            className="grid size-8 place-items-center rounded text-neutral-700 transition hover:bg-neutral-200 disabled:opacity-40 dark:text-neutral-200 dark:hover:bg-white/10"
          >
            <action.icon className="size-4" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPreview((current) => !current)}
          className={cn(
            "ms-auto inline-flex h-8 items-center gap-1.5 rounded px-2.5 text-xs font-semibold transition",
            preview ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "text-neutral-700 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-white/10"
          )}
        >
          {preview ? <Pencil className="size-3.5" /> : <Eye className="size-3.5" />}
          {preview ? "Edit" : "Preview"}
        </button>
      </div>

      {preview ? (
        <div
          className="app-rich-text-content min-h-48 px-3 py-3 text-sm leading-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <textarea
          ref={textarea}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={10}
          className="min-h-48 w-full resize-y bg-transparent px-3 py-3 text-sm leading-6 outline-none"
        />
      )}
    </div>
  );
}
