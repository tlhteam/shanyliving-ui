"use client";

import debounce from "lodash.debounce";
import { Search, X } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

export function AppSearch({ onSearch, placeholder = "Search..." }: { onSearch: (value: string) => void; placeholder?: string }) {
  const [value, setValue] = useState("");
  const debouncedSearch = useMemo(() => debounce(onSearch, 400), [onSearch]);

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    debouncedSearch(nextValue);
  };

  const clear = () => {
    setValue("");
    debouncedSearch.cancel();
    onSearch("");
  };

  return (
    <div className="flex h-11 items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 transition-colors dark:border-white/15 dark:bg-neutral-950">
      <Search className="size-4 text-neutral-500" />
      <input value={value} onChange={handleChange} placeholder={placeholder} className="w-full bg-transparent text-sm text-neutral-950 outline-none placeholder:text-neutral-400 dark:text-neutral-50 dark:placeholder:text-neutral-500" />
      {value && <button onClick={clear} aria-label="Clear search"><X className="size-4" /></button>}
    </div>
  );
}
