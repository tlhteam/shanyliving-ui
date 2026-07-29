"use client";

import { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
      <DialogContent className={cn("max-h-[90vh] overflow-y-auto p-0 sm:max-w-2xl dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-50", className)}>
        <DialogHeader className="border-b border-neutral-200 p-5 dark:border-white/10">
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <div className="p-5">{children}</div>
        {footer ? <DialogFooter className="dark:border-white/10 dark:bg-neutral-950/70">{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}
