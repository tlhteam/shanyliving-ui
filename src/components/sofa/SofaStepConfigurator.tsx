"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ChangeEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";
import { AppDialog } from "@/components/app/AppDialog";
import { AppImage } from "@/components/app/AppImage";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { StickyContactBar } from "@/components/storefront/StickyContactBar";
import { useCustomerMutation } from "@/hooks/use-customer";
import { useOptionLabel } from "@/hooks/use-option-label";
import { productColors, productConfigurations, productFabrics, productSizes, variantImage } from "@/lib/product-options";
import type { StorefrontProduct } from "@/lib/storefront-pages";
import { buildSofaQuoteMessage, generateConfigId, whatsappHref } from "@/lib/whatsapp";
import type { CustomerSavedDesign } from "@/types/customer";
const stepKeys: Record<number, "model" | "size" | "fabric" | "review"> = {
  1: "model",
  2: "size",
  3: "fabric",
  4: "review"
};

const stepQueryAliases: Record<string, 1 | 2 | 3 | 4> = {
  "1": 1,
  model: 1,
  "2": 2,
  size: 2,
  configuration: 2,
  "3": 3,
  fabric: 3,
  color: 3,
  "4": 4,
  review: 4,
  summary: 4
};

function stepFromQuery(value: string | null): 1 | 2 | 3 | 4 {
  return stepQueryAliases[String(value ?? "").toLowerCase()] ?? 1;
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function SofaPreview({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <AppImage
      src={src}
      alt={alt}
      className={`aspect-[1.35/1] rounded-lg border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900 ${className ?? ""}`}
      sizes="(max-width: 1024px) 92vw, 820px"
      imageClassName="object-contain"
    />
  );
}

export function SofaStepConfigurator({ sofaProducts }: { sofaProducts: StorefrontProduct[] }) {
  const t = useTranslations("customizer");
  const optionLabel = useOptionLabel();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const productSlug = searchParams.get("product");
  const requestedStep = searchParams.get("step");
  const requestedRoom = requestedStep === "room";
  const initialProduct = sofaProducts.find((item) => item.slug === productSlug) ?? sofaProducts[0];
  const [step, setStep] = useState<1 | 2 | 3 | 4>(requestedRoom ? 4 : stepFromQuery(requestedStep));
  const [roomMode, setRoomMode] = useState(requestedRoom);
  const [product, setProduct] = useState(initialProduct);
  const [customSizeDetail, setCustomSizeDetail] = useState("");
  const [selection, setSelection] = useState<{ size: string; configuration: string; fabric: string; color: string }>({
    size: "",
    configuration: "",
    fabric: "",
    color: ""
  });
  const [roomPhoto, setRoomPhoto] = useState<string | null>(null);
  const [aiReady, setAiReady] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const sizes = useMemo(() => productSizes(product), [product]);
  const configurations = useMemo(() => productConfigurations(product), [product]);
  const fabricChoices = useMemo(() => productFabrics(product), [product]);
  const colorChoices = useMemo(() => productColors(product), [product]);

  const size = sizes.includes(selection.size) ? selection.size : (sizes[Math.min(2, sizes.length - 1)] ?? "");
  const configuration = configurations.includes(selection.configuration)
    ? selection.configuration
    : (configurations[0] ?? "");
  const fabric = fabricChoices.find((item) => item.label === selection.fabric) ?? fabricChoices[0];
  const color = colorChoices.find((item) => item.label === selection.color) ?? colorChoices[0];

  const setSize = (value: string) => setSelection((current) => ({ ...current, size: value }));
  const setConfiguration = (value: string) => setSelection((current) => ({ ...current, configuration: value }));
  const setFabric = (value: string) => setSelection((current) => ({ ...current, fabric: value }));
  const setColor = (value: string) => setSelection((current) => ({ ...current, color: value }));

  const previewImage =
    variantImage(product, { Color: color?.label, Fabric: fabric?.label, Size: size, Configuration: configuration }) ??
    color?.image ??
    fabric?.image ??
    product.image;

  const canTransact = session?.user?.role !== "admin";
  const configId = useMemo(() => generateConfigId(), []);
  const sizeSummary = size === "Custom Size" ? `Custom${customSizeDetail ? ` (${customSizeDetail})` : ""}` : size;
  const quoteMessage = buildSofaQuoteMessage({
    productName: product.name,
    productId: product.slug,
    size: sizeSummary,
    configuration,
    fabric: fabric?.label,
    color: color?.label,
    configId,
    customerName: session?.user?.name ?? undefined,
    customerEmail: session?.user?.email ?? undefined
  });
  const quoteHref = whatsappHref(quoteMessage);
  const phoneDigits = (process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "").replace(/\D/g, "");
  const phoneHref = phoneDigits ? `tel:${phoneDigits}` : "/contact";

  const openWhatsAppQuote = () => {
    window.open(quoteHref, "_blank");
  };

  const saveDesignMutation = useCustomerMutation<void, CustomerSavedDesign>(
    "saved-designs",
    () => ({
      path: "/customer/saved-designs",
      options: {
        method: "POST",
        body: {
          title: product.name,
          status: "in_progress",
          configuration: JSON.stringify({ product: product.name, style: configuration, color: color?.label }),
          fabric: fabric?.label,
          size: sizeSummary,
          extras: "",
          image: product.image,
          notes: ""
        }
      }
    }),
    { successMessage: t("toasts.saved") }
  );

  const saveDesign = () => {
    if (!session?.user) {
      setAuthOpen(true);
      return;
    }

    if (!canTransact) {
      toast.error(t("toasts.adminBlocked"));
      return;
    }

    saveDesignMutation.mutate();
  };

  const handleRoomUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setRoomPhoto(await readFile(file));
    setAiReady(false);
    input.value = "";
  };

  const generateRoomPreview = () => {
    if (!roomPhoto) {
      toast.error(t("room.uploadFirst"));
      return;
    }

    setAiGenerating(true);
    window.setTimeout(() => {
      setAiGenerating(false);
      setAiReady(true);
      toast.success(t("room.generated"));
    }, 1600);
  };

  const summaryRows: Array<[string, string]> = [
    [t("summary.model"), product.name.replace(" Sofa", "")],
    [t("summary.size"), sizeSummary],
    [t("summary.configuration"), optionLabel(configuration)],
    [t("summary.fabric"), optionLabel(fabric?.label)],
    [t("summary.color"), optionLabel(color?.label)]
  ];

  const modelPicker = (columns: string, advanceOnSelect = false) => (
    <div className={columns}>
      {sofaProducts.map((item) => (
        <button
          key={item.slug}
          type="button"
          onClick={() => {
            setProduct(item);
            if (advanceOnSelect) setStep(2);
          }}
          className={`w-full overflow-hidden rounded-2xl bg-white p-2 shadow-[var(--shadow-elevation-1)] transition duration-200 hover:shadow-[var(--shadow-elevation-2)] dark:border dark:border-white/10 dark:bg-neutral-900 ${product.slug === item.slug ? "scale-[0.98] shadow-[var(--shadow-press)] ring-2 ring-neutral-950 dark:ring-white" : ""}`}
        >
          <AppImage src={item.image} alt={item.name} className="aspect-[2.4/1] rounded-md" sizes="(max-width: 1024px) 100vw, 320px" />
          <p className="mt-2 text-center text-sm font-bold">{item.name.replace(" Sofa", "")}</p>
        </button>
      ))}
    </div>
  );

  const sizePicker = (
    <>
      <div className="flex flex-wrap gap-3">
        {sizes.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSize(item)}
            className={`rounded-md border px-4 py-3 text-sm font-bold transition ${size === item ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950" : "border-neutral-200 hover:border-neutral-400 dark:border-white/10"}`}
          >
            {item}
          </button>
        ))}
      </div>
      {size === "Custom Size" ? (
        <div className="mt-4 space-y-2 rounded-md border border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-neutral-900">
          <label htmlFor="custom-size-detail" className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
            {t("customSizeLabel")}
          </label>
          <input
            id="custom-size-detail"
            type="text"
            value={customSizeDetail}
            onChange={(event) => setCustomSizeDetail(event.target.value)}
            placeholder={t("customSizePlaceholder")}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-950 dark:border-white/15 dark:bg-neutral-950 dark:focus:border-white"
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{t("customSizeHint")}</p>
        </div>
      ) : null}
      <h2 className="mt-8 font-bold">{t("configuration")}</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {configurations.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setConfiguration(item)}
            className={`rounded-md border px-4 py-3 text-sm font-bold transition ${configuration === item ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950" : "border-neutral-200 hover:border-neutral-400 dark:border-white/10"}`}
          >
            {optionLabel(item)}
          </button>
        ))}
      </div>
    </>
  );

  const fabricPicker = (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
        {fabricChoices.map((item) => (
          <button key={item.label} type="button" onClick={() => setFabric(item.label)} className="text-center text-xs font-bold">
            <AppImage
              src={item.image ?? ""}
              alt={optionLabel(item.label)}
              className={`aspect-square rounded-md border transition hover:scale-[1.03] ${fabric?.label === item.label ? "border-neutral-950 ring-2 ring-neutral-950/15 dark:border-white dark:ring-white/25" : "border-neutral-200 dark:border-white/10"}`}
              sizes="120px"
            />
            <span className="mt-2 block leading-tight">{optionLabel(item.label)}</span>
          </button>
        ))}
      </div>
      <h2 className="mt-8 font-bold">{t("colorTitle", { fabric: optionLabel(fabric?.label) })}</h2>
      <div className="mt-5 flex flex-wrap gap-4">
        {colorChoices.map((item) => (
          <button key={item.label} type="button" onClick={() => setColor(item.label)} aria-label={optionLabel(item.label)} title={optionLabel(item.label)} className="group text-center text-xs font-bold">
            <span
              className={`block size-12 overflow-hidden rounded-full border-2 transition group-hover:scale-110 ${color?.label === item.label ? "border-neutral-950 ring-2 ring-neutral-950/15 dark:border-white dark:ring-white/25" : "border-transparent"}`}
              style={item.swatch ? { backgroundColor: item.swatch } : undefined}
            >
              {!item.swatch && item.image ? (
                <AppImage src={item.image} alt={optionLabel(item.label)} className="size-full" sizes="48px" />
              ) : null}
            </span>
            <span className="mt-2 block max-w-16 text-[10px] leading-tight text-neutral-700 dark:text-neutral-300">{optionLabel(item.label)}</span>
          </button>
        ))}
      </div>
    </>
  );

  const stepRail = (
    <div className="relative flex items-start justify-between">
      <div className="absolute inset-x-4 top-[18px] z-0 border-t border-dashed border-neutral-300 dark:border-white/25" />
      {[1, 2, 3, 4].map((item) => (
        <button key={item} type="button" onClick={() => setStep(item as 1 | 2 | 3 | 4)} className="relative z-10 flex flex-col items-center gap-1.5">
          <span
            className={`grid size-9 place-items-center rounded-full border text-sm font-bold transition hover:scale-105 ${step === item ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950" : "border-neutral-300 bg-white text-neutral-600 dark:border-white/20 dark:bg-neutral-950 dark:text-neutral-300"}`}
          >
            {item}
          </span>
          <span className={`max-w-16 text-center text-[10px] leading-tight font-bold ${step === item ? "text-neutral-950 dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}>
            {t(`steps.${stepKeys[item]}`)}
          </span>
        </button>
      ))}
    </div>
  );

  if (roomMode) {
    const uploadPane = (
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900">
        {roomPhoto ? (
          <div className="relative">
            <AppImage src={roomPhoto} alt={t("room.uploaded")} className="aspect-[0.78/1] lg:aspect-[1.4/1]" sizes="(max-width: 1024px) 100vw, 720px" imageClassName="object-cover" />
            {aiGenerating ? (
              <div className="absolute inset-0 grid place-items-center bg-black/35 text-white">
                <div className="rounded-lg bg-neutral-950/80 px-5 py-4 text-center shadow-xl">
                  <SiteIcon name="fabric" className="mx-auto size-6 animate-pulse" />
                  <p className="mt-2 text-sm font-bold">{t("room.generating")}</p>
                  <p className="mt-1 text-xs text-white/70">{t("room.generatingHint")}</p>
                </div>
              </div>
            ) : null}
            {aiReady ? (
              <div className="absolute inset-x-4 bottom-4 rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur animate-in fade-in slide-in-from-bottom-2 dark:bg-neutral-950/90">
                <div className="grid grid-cols-[88px_1fr] gap-3">
                  <AppImage src={product.image} alt={product.name} className="aspect-[1.25/1] rounded-md" sizes="88px" />
                  <div>
                    <p className="font-bold">{t("room.ready")}</p>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{t("room.readyHint", { product: product.name, fabric: optionLabel(fabric?.label), color: optionLabel(color?.label) })}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <label className="grid min-h-80 cursor-pointer place-items-center border border-dashed border-neutral-300 p-8 text-center transition hover:border-neutral-500 dark:border-white/15 lg:min-h-[420px]">
            <span>
              <SiteIcon name="upload" className="mx-auto size-10" />
              <span className="mt-3 block font-bold">{t("room.upload")}</span>
              <span className="mt-1 block text-xs text-neutral-500">{t("room.uploadHint")}</span>
            </span>
            <input type="file" accept="image/*" className="sr-only" onChange={handleRoomUpload} />
          </label>
        )}
      </div>
    );

    const tips = (
      <div className="space-y-3 text-sm">
        {(["light", "perspective", "clear"] as const).map((tip) => (
          <p key={tip} className="flex items-center gap-2"><SiteIcon name="check" className="size-4 text-green-600" /> {t(`room.tips.${tip}`)}</p>
        ))}
      </div>
    );

    const roomActions = (
      <div className="space-y-3">
        {aiReady ? (
          <>
            <AppButton className="w-full gap-2" onClick={openWhatsAppQuote}>
              <WhatsappIcon className="size-4" /> {t("quoteWhatsapp")}
            </AppButton>
            <Link href={phoneHref} className="block">
              <AppButton variant="outline" className="w-full gap-2">
                <SiteIcon name="phone" className="size-4" /> {t("callForPrice")}
              </AppButton>
            </Link>
            <AppButton
              variant="outline"
              className="w-full"
              onClick={() => { setRoomPhoto(null); setAiReady(false); setAiGenerating(false); }}
            >
              {t("room.tryAnother")}
            </AppButton>
          </>
        ) : (
          <AppButton className="w-full" onClick={generateRoomPreview} disabled={!roomPhoto || aiGenerating} loading={aiGenerating}>{t("room.generate")}</AppButton>
        )}
      </div>
    );

    return (
      <div className="bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="mx-auto min-h-screen max-w-md px-4 py-8 pb-24 lg:hidden">
          <button type="button" onClick={() => setRoomMode(false)} className="mb-5 text-sm font-bold">{t("room.back")}</button>
          <h1 className="text-2xl font-bold">{t("room.title")}</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{t("room.subtitle")}</p>
          <div className="mt-6">{uploadPane}</div>
          <div className="mt-6">{tips}</div>
          <p className="mt-10 text-center text-xs font-bold text-neutral-500">{t("room.poweredBy")}</p>
          <div className="mt-6">{roomActions}</div>
        </div>

        <StickyContactBar whatsappHref={quoteHref} />

        <div className="mx-auto hidden min-h-screen w-full max-w-6xl px-8 py-12 lg:block">
          <button type="button" onClick={() => setRoomMode(false)} className="mb-6 text-sm font-bold">{t("room.back")}</button>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <h1 className="font-serif text-4xl font-bold">{t("room.title")}</h1>
              <p className="mt-3 max-w-xl text-neutral-600 dark:text-neutral-400">{t("room.subtitleLong", { product: product.name, fabric: optionLabel(fabric?.label), color: optionLabel(color?.label) })}</p>
              <div className="mt-8">{uploadPane}</div>
            </div>
            <aside className="sticky top-24 space-y-6 rounded-lg border border-neutral-200 p-6 dark:border-white/10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">{t("room.tipsTitle")}</p>
                <div className="mt-4">{tips}</div>
              </div>
              {roomActions}
              <p className="text-center text-xs font-bold text-neutral-500">{t("room.poweredBy")}</p>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="mx-auto min-h-screen max-w-md px-4 py-8 pb-24 lg:hidden">
        <div className="mb-8">{stepRail}</div>

        {step === 1 ? (
          <section>
            <h1 className="font-bold">{t("modelTitle")}</h1>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{t("modelHint")}</p>
            {modelPicker("mt-5 space-y-3", true)}
          </section>
        ) : null}

        {step === 2 ? (
          <section>
            <h1 className="font-bold">{t("sizeTitle")}</h1>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{t("sizeHint")}</p>
            <div className="mt-8">{sizePicker}</div>
            <SofaPreview src={previewImage} alt={product.name} className="mt-10" />
          </section>
        ) : null}

        {step === 3 ? (
          <section>
            <h1 className="font-bold">{t("fabricTitle")}</h1>
            <div className="mt-5">{fabricPicker}</div>
            <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-neutral-900">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">{t("preview")}</p>
              <p className="mt-1 text-sm font-bold">{t("previewCaption", { fabric: optionLabel(fabric?.label), color: optionLabel(color?.label) })}</p>
              <SofaPreview src={previewImage} alt={product.name} className="mt-4" />
            </div>
          </section>
        ) : null}

        {step < 4 ? (
          <div className="mt-8 border-t border-neutral-200 pt-5 dark:border-white/10">
            <p className="text-sm leading-6 text-neutral-700 dark:text-neutral-300">
              {t("customNote")}
            </p>
            <AppButton className="mt-5 w-full" onClick={() => setStep((step + 1) as 1 | 2 | 3 | 4)}>
              {t("next")}
            </AppButton>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)}
                className="mt-4 w-full text-center text-sm font-bold text-neutral-600 underline dark:text-neutral-300"
              >
                {t("backTo", { step: t(`steps.${stepKeys[step - 1]}`) })}
              </button>
            ) : null}
          </div>
        ) : null}

        {step === 4 ? (
          <section>
            <h1 className="font-bold">{t("reviewTitle")}</h1>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{t("reviewHint")}</p>
            <AppImage src={product.image} alt={product.name} className="mt-5 aspect-[1.2/1] rounded-lg" sizes="448px" />
            <div className="mt-5 space-y-3 text-sm">
              {summaryRows.map(([label, value]) => (
                <p key={label} className="flex justify-between"><span className="font-bold">{label}</span><span>{value}</span></p>
              ))}
            </div>
            <div className="mt-8 border-t border-neutral-200 pt-5 dark:border-white/10">
              <p className="text-sm leading-6 text-neutral-700 dark:text-neutral-300">
                {t("reviewNote")}
              </p>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{t("delivery")}</p>
            </div>
            <AppButton className="mt-6 w-full gap-2" onClick={openWhatsAppQuote}>
              <WhatsappIcon className="size-4" /> {t("quoteWhatsapp")}
            </AppButton>
            <Link href={phoneHref} className="mt-3 block">
              <AppButton variant="outline" className="w-full gap-2">
                <SiteIcon name="phone" className="size-4" /> {t("callForPrice")}
              </AppButton>
            </Link>
            <AppButton variant="outline" className="mt-3 w-full gap-2" loading={saveDesignMutation.isPending} onClick={saveDesign}><SiteIcon name="heart" className="size-4" /> {t("saveDesign")}</AppButton>
            <AppButton variant="outline" className="mt-3 w-full" onClick={() => setRoomMode(true)}>{t("seeInRoom")}</AppButton>
          </section>
        ) : null}
      </div>

      {step === 4 ? <StickyContactBar whatsappHref={quoteHref} /> : null}

      <div className="mx-auto hidden min-h-screen w-full max-w-7xl px-8 py-12 lg:block">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">{t("eyebrow")}</p>
            <h1 className="mt-2 font-serif text-4xl font-bold">{product.name.replace(" Sofa", "")}</h1>
          </div>
          <div className="flex items-center gap-6">
            {[1, 2, 3, 4].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStep(item as 1 | 2 | 3 | 4)}
                className="flex items-center gap-2 text-sm font-bold transition hover:opacity-80"
              >
                <span className={`grid size-8 place-items-center rounded-full border text-xs ${step === item ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950" : "border-neutral-300 text-neutral-500 dark:border-white/20"}`}>
                  {item}
                </span>
                <span className={step === item ? "" : "text-neutral-500"}>{t(`steps.${stepKeys[item]}`)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-lg border border-neutral-200 p-6 dark:border-white/10">
              {step === 3 ? (
                <p className="mb-4 text-center text-sm font-bold">
                  {optionLabel(fabric?.label)} · {optionLabel(color?.label)}
                </p>
              ) : null}
              <SofaPreview src={step === 1 ? product.image : previewImage} alt={product.name} />
            </div>
          </div>

          <aside className="space-y-6 rounded-lg border border-neutral-200 p-6 dark:border-white/10">
            {step === 1 ? (
              <section>
                <h2 className="font-serif text-2xl font-bold">{t("modelTitle")}</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{t("modelHint")}</p>
                {modelPicker("mt-6 grid grid-cols-2 gap-3")}
              </section>
            ) : null}

            {step === 2 ? (
              <section>
                <h2 className="font-serif text-2xl font-bold">{t("sizeTitle")}</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{t("sizeHint")}</p>
                <div className="mt-6">{sizePicker}</div>
              </section>
            ) : null}

            {step === 3 ? (
              <section>
                <h2 className="font-serif text-2xl font-bold">{t("fabricColorTitle")}</h2>
                <div className="mt-6">{fabricPicker}</div>
              </section>
            ) : null}

            {step === 4 ? (
              <section>
                <h2 className="font-serif text-2xl font-bold">{t("reviewTitle")}</h2>
                <div className="mt-5 space-y-3 text-sm">
                  {summaryRows.map(([label, value]) => (
                    <p key={label} className="flex justify-between border-b border-neutral-100 pb-2 dark:border-white/5">
                      <span className="font-bold">{label}</span>
                      <span>{value}</span>
                    </p>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="border-t border-neutral-200 pt-5 dark:border-white/10">
              <div className="flex items-end justify-between gap-4">
                <p className="text-sm leading-6 text-neutral-700 dark:text-neutral-300">
                  {step === 4 ? t("reviewNote") : t("customNote")}
                </p>
                <p className="shrink-0 text-xs text-neutral-600 dark:text-neutral-400">{t("deliveryShort")}</p>
              </div>

              {step < 4 ? (
                <AppButton className="mt-5 w-full" onClick={() => setStep((step + 1) as 1 | 2 | 3 | 4)}>
                  {t("next")}
                </AppButton>
              ) : (
                <>
                  <AppButton className="mt-5 w-full gap-2" onClick={openWhatsAppQuote}>
                    <WhatsappIcon className="size-4" /> {t("quoteWhatsapp")}
                  </AppButton>
                  <Link href={phoneHref} className="mt-3 block">
                    <AppButton variant="outline" className="w-full gap-2">
                      <SiteIcon name="phone" className="size-4" /> {t("callForPrice")}
                    </AppButton>
                  </Link>
                  <AppButton variant="outline" className="mt-3 w-full gap-2" loading={saveDesignMutation.isPending} onClick={saveDesign}><SiteIcon name="heart" className="size-4" /> {t("saveDesign")}</AppButton>
                  <AppButton variant="outline" className="mt-3 w-full" onClick={() => setRoomMode(true)}>{t("seeInRoom")}</AppButton>
                </>
              )}

              {step > 1 ? (
                <button type="button" onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)} className="mt-4 w-full text-sm font-bold text-neutral-600 underline dark:text-neutral-300">
                  {t("backTo", { step: t(`steps.${stepKeys[step - 1]}`) })}
                </button>
              ) : null}
            </div>
          </aside>
        </div>
      </div>

      <AppDialog open={authOpen} onOpenChange={setAuthOpen} title={t("signInTitle")} description={t("signInText")}>
        <div className="space-y-4">
          <SocialAuthButtons callbackUrl="/customize-your-sofa" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/login?callbackUrl=/customize-your-sofa"><AppButton variant="outline" className="w-full">{t("signIn")}</AppButton></Link>
            <Link href="/register"><AppButton className="w-full">{t("createAccount")}</AppButton></Link>
          </div>
        </div>
      </AppDialog>
    </div>
  );
}
