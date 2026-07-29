"use client";

import { create } from "zustand";
import type { AdminRow } from "@/lib/admin-data";

type AdminDialogMode = "create" | "edit" | "view" | "delete" | null;

type AdminCrudState = {
  query: string;
  page: number;
  pageSize: number;
  mode: AdminDialogMode;
  selected: AdminRow | null;
  draft: AdminRow;
  confirmText: string;
  setQuery: (query: string) => void;
  setPage: (page: number) => void;
  openCreate: (draft: AdminRow) => void;
  openView: (row: AdminRow) => void;
  openEdit: (row: AdminRow) => void;
  openDelete: (row: AdminRow) => void;
  updateDraft: (key: string, value: string) => void;
  setConfirmText: (value: string) => void;
  close: () => void;
};

export const useAdminCrudStore = create<AdminCrudState>((set) => ({
  query: "",
  page: 1,
  pageSize: 5,
  mode: null,
  selected: null,
  draft: {},
  confirmText: "",
  setQuery: (query) => set({ query, page: 1 }),
  setPage: (page) => set({ page }),
  openCreate: (draft) => set({ mode: "create", selected: null, draft, confirmText: "" }),
  openView: (row) => set({ mode: "view", selected: row, draft: row, confirmText: "" }),
  openEdit: (row) => set({ mode: "edit", selected: row, draft: row, confirmText: "" }),
  openDelete: (row) => set({ mode: "delete", selected: row, draft: row, confirmText: "" }),
  updateDraft: (key, value) => set((state) => ({ draft: { ...state.draft, [key]: value } })),
  setConfirmText: (value) => set({ confirmText: value }),
  close: () => set({ mode: null, selected: null, draft: {}, confirmText: "" }),
}));
