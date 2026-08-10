"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlignCenter, AlignLeft, AlignRight, Armchair, Check, Grid3X3, Layers3, LogIn, MessageCircle, Palette, Ruler, Save, Sofa, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";
import { AppDialog } from "@/components/app/AppDialog";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { useApi } from "@/hooks/use-api";

type Module = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const fabrics = ["Performance Linen", "Soft Boucle", "Pet Friendly Weave", "Velvet Touch"];
const colors = ["Ivory", "Warm Beige", "Forest", "Walnut"];
const legs = ["Hidden", "Oak", "Walnut", "Black Metal"];
const templates: Module[][] = [
  [{ id: "seat-1", label: "Seat", x: 26, y: 42, w: 26, h: 20 }, { id: "seat-2", label: "Seat", x: 52, y: 42, w: 26, h: 20 }, { id: "chaise", label: "Chaise", x: 26, y: 62, w: 26, h: 26 }],
  [{ id: "left", label: "Left", x: 22, y: 46, w: 22, h: 20 }, { id: "center", label: "Center", x: 44, y: 46, w: 22, h: 20 }, { id: "right", label: "Right", x: 66, y: 46, w: 22, h: 20 }],
  [{ id: "corner", label: "Corner", x: 30, y: 36, w: 24, h: 22 }, { id: "long", label: "Long", x: 54, y: 36, w: 26, h: 22 }, { id: "return", label: "Return", x: 30, y: 58, w: 24, h: 24 }]
];

export default function CustomizeYourSofaPage() {
  const { data: session } = useSession();
  const { request } = useApi();
  const queryClient = useQueryClient();
  const [modules, setModules] = useState<Module[]>(templates[0]);
  const [fabric, setFabric] = useState(fabrics[0]);
  const [color, setColor] = useState(colors[0]);
  const [leg, setLeg] = useState(legs[0]);
  const [size, setSize] = useState(280);
  const [align, setAlign] = useState<"left" | "center" | "right">("center");
  const [authOpen, setAuthOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const title = `${color} ${fabric} ${modules.length > 2 ? "Modular" : "Straight"} Sofa`;
  const price = useMemo(() => 4200 + modules.length * 520 + Math.max(0, size - 220) * 8, [modules.length, size]);
  const configuration = useMemo(() => JSON.stringify({ modules, align }), [align, modules]);

  const saveMutation = useMutation({
    mutationFn: () => request("/customer/saved-designs", {
      method: "POST",
      body: {
        title,
        status: "in_progress",
        configuration,
        fabric,
        color,
        size: `${size} cm`,
        extras: `Legs: ${leg}`,
        image: "/images/sofa-cloud-modular.png",
        price,
        notes: "Saved from sofa editor"
      }
    }),
    onSuccess: () => {
      toast.success("Design saved to your account.");
      queryClient.invalidateQueries({ queryKey: ["customer", "saved-designs"] });
    },
    onError: (error: Error) => toast.error(error.message)
  });

  const saveDesign = () => {
    if (!session?.user) {
      setAuthOpen(true);
      return;
    }

    saveMutation.mutate();
  };

  const dropModule = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!draggedId) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(82, Math.max(2, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(78, Math.max(8, ((event.clientY - rect.top) / rect.height) * 100));

    setModules((current) => current.map((module) => module.id === draggedId ? { ...module, x, y } : module));
    setDraggedId(null);
  };

  return (
    <main className="bg-neutral-50 text-neutral-950">
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[320px_1fr_300px] lg:px-8">
        <aside className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Sofa Studio</p>
            <h1 className="mt-2 font-serif text-3xl font-bold">Customize Your Sofa</h1>
            <p className="mt-2 text-sm text-neutral-600">Drag modules, choose finishes, then save the design to your customer account.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {templates.map((template, index) => (
              <button key={index} type="button" onClick={() => setModules(template)} className="rounded-md border border-neutral-200 p-3 text-xs font-bold hover:border-neutral-950">
                <Layers3 className="mx-auto mb-2 size-5" />
                Layout {index + 1}
              </button>
            ))}
          </div>
          <label className="block text-sm font-bold">Size: {size} cm</label>
          <input type="range" min={220} max={360} value={size} onChange={(event) => setSize(Number(event.target.value))} className="w-full" />
          <label className="block text-sm font-bold">Fabric</label>
          <select value={fabric} onChange={(event) => setFabric(event.target.value)} className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm">
            {fabrics.map((item) => <option key={item}>{item}</option>)}
          </select>
          <label className="block text-sm font-bold">Color</label>
          <select value={color} onChange={(event) => setColor(event.target.value)} className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm">
            {colors.map((item) => <option key={item}>{item}</option>)}
          </select>
          <label className="block text-sm font-bold">Legs</label>
          <select value={leg} onChange={(event) => setLeg(event.target.value)} className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm">
            {legs.map((item) => <option key={item}>{item}</option>)}
          </select>
        </aside>

        <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {(["left", "center", "right"] as const).map((value) => {
                const Icon = value === "left" ? AlignLeft : value === "center" ? AlignCenter : AlignRight;

                return <button key={value} type="button" onClick={() => setAlign(value)} className={`grid size-10 place-items-center rounded-md border ${align === value ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200"}`}><Icon className="size-4" /></button>;
              })}
            </div>
            <div className="flex gap-2">
              <AppButton variant="outline" className="gap-2" onClick={() => setModules((current) => [...current, { id: `seat-${Date.now()}`, label: "Seat", x: 44, y: 44, w: 22, h: 20 }])}><Sofa className="size-4" /> Add Seat</AppButton>
              <AppButton variant="outline" className="gap-2" onClick={() => setModules((current) => current.slice(0, -1))} disabled={modules.length <= 1}><Trash2 className="size-4" /> Remove</AppButton>
            </div>
          </div>
          <div onDragOver={(event) => event.preventDefault()} onDrop={dropModule} className="relative min-h-[520px] overflow-hidden rounded-lg bg-[linear-gradient(135deg,#f6f1ea,#dfd5c8)]">
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:48px_48px]" />
            {modules.map((module) => (
              <button
                key={module.id}
                type="button"
                draggable
                onDragStart={() => setDraggedId(module.id)}
                className="absolute cursor-grab rounded-xl border border-neutral-950/15 bg-white/90 p-3 text-xs font-bold shadow-md active:cursor-grabbing"
                style={{ left: `${module.x}%`, top: `${module.y}%`, width: `${module.w}%`, height: `${module.h}%`, transform: align === "center" ? "translateX(-50%)" : align === "right" ? "translateX(-100%)" : undefined }}
              >
                <Armchair className="mx-auto mb-2 size-5" />
                {module.label}
              </button>
            ))}
          </div>
        </section>

        <aside className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <h2 className="font-serif text-2xl font-bold">Design Summary</h2>
          {[
            [Sofa, "Model", modules.length > 2 ? "Modular Sofa" : "Straight Sofa"],
            [Ruler, "Size", `${size} cm`],
            [Palette, "Fabric", fabric],
            [Grid3X3, "Color", color],
            [Armchair, "Legs", leg]
          ].map(([Icon, label, value]) => (
            <div key={String(label)} className="flex items-center gap-3 rounded-md border border-neutral-200 p-3">
              <Icon className="size-5" />
              <div><p className="text-xs font-bold text-neutral-500">{String(label)}</p><p className="font-bold">{String(value)}</p></div>
            </div>
          ))}
          <p className="font-serif text-3xl font-bold">₪ {price.toLocaleString()}</p>
          <AppButton className="w-full gap-2" loading={saveMutation.isPending} onClick={saveDesign}><Save className="size-4" /> Save My Design</AppButton>
          <Link href="/showroom"><AppButton variant="outline" className="w-full gap-2"><MessageCircle className="size-4" /> Ask for Help</AppButton></Link>
        </aside>
      </section>

      <AppDialog open={authOpen} onOpenChange={setAuthOpen} title="Save your sofa design" description="Create an account or sign in so this design appears in your Saved Designs panel.">
        <div className="space-y-4">
          <SocialAuthButtons callbackUrl="/customize-your-sofa" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/login?callbackUrl=/customize-your-sofa"><AppButton variant="outline" className="w-full gap-2"><LogIn className="size-4" /> Sign In</AppButton></Link>
            <Link href="/register"><AppButton className="w-full gap-2"><Check className="size-4" /> Create Account</AppButton></Link>
          </div>
        </div>
      </AppDialog>
    </main>
  );
}
