"use client";

import { useMemo, useState } from "react";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Eye, Pencil, RefreshCcw } from "lucide-react";
import { AppButton } from "@/components/app/AppButton";
import { AppCard } from "@/components/app/AppCard";
import { AppTable } from "@/components/app/AppTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { AdminRow } from "@/lib/admin-data";

type AdminResourcePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  action: string;
  rows: AdminRow[];
  columns: { key: string; label: string; badge?: boolean; swatch?: boolean }[];
};

function statusVariant(value: string | number): "default" | "secondary" | "destructive" {
  const text = String(value).toLowerCase();

  if (text.includes("active") || text.includes("booked") || text.includes("sent") || text.includes("yes")) {
    return "default";
  }

  if (text.includes("draft") || text.includes("pending") || text.includes("required") || text.includes("needs")) {
    return "destructive";
  }

  return "secondary";
}

export function AdminResourcePage({ eyebrow, title, description, action, rows, columns }: AdminResourcePageProps) {
  const [selected, setSelected] = useState<AdminRow | null>(null);

  const tableColumns = useMemo<ColumnDef<AdminRow>[]>(() => [
    ...columns.map((column) => ({
      accessorKey: column.key,
      header: column.label,
      cell: ({ row }: CellContext<AdminRow, unknown>) => {
        const value = row.original[column.key];

        if (column.swatch) {
          return (
            <div className="flex items-center gap-2">
              <span className="size-5 rounded-full border border-neutral-300" style={{ backgroundColor: String(value) }} />
              <span className="font-mono text-xs">{String(value)}</span>
            </div>
          );
        }

        if (column.badge) {
          return <Badge variant={statusVariant(value)}>{String(value)}</Badge>;
        }

        return <span className="font-medium">{String(value)}</span>;
      }
    })),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            setSelected(row.original);
            toast.info(`${title} details opened`);
          }}>
            <Eye className="size-3.5" />
            View
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toast.warning("Editing is prepared for API write integration.")}>
            <Pencil className="size-3.5" />
            Edit
          </Button>
        </div>
      )
    }
  ], [columns, title]);

  return (
    <>
      <AdminPageHeader eyebrow={eyebrow} title={title} description={description} action={action} />
      <AppCard className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-white/10">
          <div>
            <h2 className="font-bold">{title} List</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{rows.length} records ready for management</p>
          </div>
          <Button variant="outline" onClick={() => toast.success(`${title} data refreshed`)}>
            <RefreshCcw className="size-4" />
            Refresh
          </Button>
        </div>
        <AppTable data={rows} columns={tableColumns} />
      </AppCard>
      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="p-0">
          <SheetHeader className="border-b border-neutral-200 dark:border-white/10">
            <SheetTitle>{title} Details</SheetTitle>
            <SheetDescription>Review the selected record before editing or syncing with the API.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 p-4">
            {selected ? Object.entries(selected).map(([key, value]) => (
              <div key={key} className="rounded-md border border-neutral-200 p-3 dark:border-white/10">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">{key.replace(/([A-Z])/g, " $1")}</p>
                <p className="mt-1 font-semibold">{String(value)}</p>
              </div>
            )) : null}
            <AppButton className="w-full" onClick={() => toast.success("Record queued for follow-up")}>Mark for Follow-up</AppButton>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
