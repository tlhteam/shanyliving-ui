"use client";

import { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type AppTagInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
};

export function AppTagInput({ value, onChange, placeholder = "Add a tag and press Enter", suggestions = [], className }: AppTagInputProps) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const tag = raw.trim().replace(/,+$/, "");

    if (!tag) {
      return;
    }

    if (!value.some((current) => current.toLowerCase() === tag.toLowerCase())) {
      onChange([...value, tag]);
    }

    setDraft("");
  };

  const remove = (tag: string) => onChange(value.filter((current) => current !== tag));

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      add(draft);

      return;
    }

    if (event.key === "Backspace" && draft === "" && value.length) {
      remove(value[value.length - 1]);
    }
  };

  const available = suggestions.filter((suggestion) => !value.some((current) => current.toLowerCase() === suggestion.toLowerCase()));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-neutral-300 p-2 focus-within:border-neutral-950 dark:border-white/15 dark:focus-within:border-white">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold dark:bg-white/10">
            {tag}
            <button type="button" aria-label={`Remove ${tag}`} onClick={() => remove(tag)} className="text-neutral-500 transition hover:text-red-600">
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => add(draft)}
          placeholder={value.length ? "" : placeholder}
          className="h-8 min-w-32 flex-1 bg-transparent px-1 text-sm outline-none"
        />
      </div>
      {available.length ? (
        <div className="flex flex-wrap gap-2">
          {available.slice(0, 8).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => add(suggestion)}
              className="rounded-full border border-dashed border-neutral-300 px-3 py-1 text-xs text-neutral-600 transition hover:border-neutral-950 hover:text-neutral-950 dark:border-white/15 dark:text-neutral-300"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
