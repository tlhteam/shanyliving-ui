"use client";

import { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AppDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function AppDialog({ open, onOpenChange, title, description, children, footer, className }: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-h-[88vh] overflow-hidden rounded-xl border border-neutral-200 bg-white p-0 text-neutral-950 shadow-2xl ring-0 sm:max-w-2xl dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50", className)}>
        <DialogHeader className="border-b border-neutral-200 bg-neutral-50 p-5 dark:border-white/10 dark:bg-neutral-950/70">
          <DialogTitle className="font-serif text-2xl font-bold leading-tight">{title}</DialogTitle>
          {description ? <DialogDescription className="mt-1 max-w-xl leading-6">{description}</DialogDescription> : null}
        </DialogHeader>
        <div className="max-h-[58vh] overflow-y-auto p-5">{children}</div>
        {footer ? <div className="flex flex-col-reverse gap-2 border-t border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-neutral-950/70 sm:flex-row sm:justify-end">{footer}</div> : null}
      </DialogContent>
    </Dialog>
  );
}
