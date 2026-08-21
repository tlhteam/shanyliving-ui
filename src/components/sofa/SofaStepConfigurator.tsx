"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChangeEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppButton } from "@/components/app/AppButton";
import { AppDialog } from "@/components/app/AppDialog";
import { AppImage } from "@/components/app/AppImage";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { getStorefrontProduct, storefrontProducts } from "@/lib/storefront-pages";
import { useCustomerCommerceStore } from "@/stores/customer-commerce-store";

const sizes = ["2.2m", "2.4m", "2.8m", "3.2m"];
const configurations = ["Left chaise", "Right chaise"];
const fabrics = [
  { name: "Boucle", image: "/images/category-sofas.png" },
  { name: "Linen", image: "/images/product-linen-cushion.png" },
  { name: "Chenille", image: "/images/look-warm-minimalism.png" },
  { name: "Velvet", image: "/images/look-urban-luxury.png" }
];
const colors = [
  { name: "Light Beige", value: "#eee9df" },
  { name: "Sand", value: "#d9d4ca" },
  { name: "Caramel", value: "#b1845f" },
  { name: "Espresso", value: "#3d271c" },
  { name: "Forest", value: "#183421" }
];

const stepLabels: Record<number, string> = {
  1: "Model",
  2: "Size",
  3: "Fabric",
  4: "Review"
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

function formatPrice(price: number) {
  return `NIS ${new Intl.NumberFormat("en").format(price)}`;
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function SofaStepConfigurator() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const addToCart = useCustomerCommerceStore((state) => state.addToCart);
  const openCart = useCustomerCommerceStore((state) => state.openCart);
  const productSlug = searchParams.get("product");
  const requestedStep = searchParams.get("step");
  const requestedRoom = requestedStep === "room";
  const sofaProducts = useMemo(() => storefrontProducts.filter((product) => product.category === "sofas").slice(0, 5), []);
  const initialProduct = productSlug ? getStorefrontProduct(productSlug) : sofaProducts[0];
  const [step, setStep] = useState<1 | 2 | 3 | 4>(requestedRoom ? 4 : stepFromQuery(requestedStep));
  const [roomMode, setRoomMode] = useState(requestedRoom);
  const [product, setProduct] = useState(initialProduct ?? sofaProducts[0]);
  const [size, setSize] = useState("2.8m");
  const [configuration, setConfiguration] = useState("Right chaise");
  const [fabric, setFabric] = useState(fabrics[0]);
  const [color, setColor] = useState(colors[0]);
  const [roomPhoto, setRoomPhoto] = useState<string | null>(null);
  const [aiReady, setAiReady] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const canTransact = session?.user?.role !== "admin";
  const finalPrice = product.price + (size === "3.2m" ? 900 : size === "2.8m" ? 400 : 0);

  const addDesignToCart = () => {
    if (!canTransact) {
      toast.error("Admin accounts cannot create storefront transactions. Please use a customer account.");
      return;
    }

    addToCart(product, {
      size,
      configuration,
      fabric: fabric.name,
      color: color.name
    });
    toast.success(`${product.name} added to cart.`);
    openCart();
  };

  const saveDesign = () => {
    if (!session?.user) {
      setAuthOpen(true);
      return;
    }

    if (!canTransact) {
      toast.error("Admin accounts cannot save customer designs.");
      return;
    }

    toast.success("Design saved to your account.");
  };

  const shareDesign = async () => {
    const text = `${product.name} - ${size}, ${configuration}, ${fabric.name}, ${color.name}`;

    if (navigator.share) {
      await navigator.share({ title: "Shany Living sofa design", text }).catch(() => undefined);
      return;
    }

    await navigator.clipboard?.writeText(text);
    toast.success("Design details copied.");
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
      toast.error("Upload a room photo first.");
      return;
    }

    setAiGenerating(true);
    window.setTimeout(() => {
      setAiGenerating(false);
      setAiReady(true);
      toast.success("Room preview generated.");
    }, 1600);
  };

  const summaryRows: Array<[string, string]> = [
    ["Model", product.name.replace(" Sofa", "")],
    ["Size", size],
    ["Configuration", configuration],
    ["Fabric", fabric.name],
    ["Color", color.name]
  ];

  const modelPicker = (columns: string) => (
    <div className={columns}>
      {sofaProducts.map((item) => (
        <button
          key={item.slug}
          type="button"
          onClick={() => setProduct(item)}
          className={`w-full overflow-hidden rounded-lg border bg-white p-2 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-neutral-900 ${product.slug === item.slug ? "border-neutral-950 dark:border-white" : "border-neutral-200 dark:border-white/10"}`}
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
      <h2 className="mt-8 font-bold">Configuration</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {configurations.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setConfiguration(item)}
            className={`rounded-md border px-4 py-3 text-sm font-bold transition ${configuration === item ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950" : "border-neutral-200 hover:border-neutral-400 dark:border-white/10"}`}
          >
            {item}
          </button>
        ))}
      </div>
    </>
  );

  const fabricPicker = (
    <>
      <div className="grid grid-cols-4 gap-3">
        {fabrics.map((item) => (
          <button key={item.name} type="button" onClick={() => setFabric(item)} className="text-center text-xs font-bold">
            <AppImage
              src={item.image}
              alt={item.name}
              className={`aspect-square rounded-md border transition hover:scale-[1.03] ${fabric.name === item.name ? "border-neutral-950 ring-2 ring-neutral-950/15 dark:border-white dark:ring-white/25" : "border-neutral-200 dark:border-white/10"}`}
              sizes="120px"
            />
            <span className="mt-2 block">{item.name}</span>
          </button>
        ))}
      </div>
      <h2 className="mt-8 font-bold">Choose color - {fabric.name}</h2>
      <div className="mt-5 flex flex-wrap gap-4">
        {colors.map((item) => (
          <button key={item.name} type="button" onClick={() => setColor(item)} aria-label={item.name} title={item.name} className="group text-center text-xs font-bold">
            <span
              className={`block size-12 rounded-full border-2 transition group-hover:scale-110 ${color.name === item.name ? "border-neutral-950 ring-2 ring-neutral-950/15 dark:border-white dark:ring-white/25" : "border-transparent"}`}
              style={{ backgroundColor: item.value }}
            />
            <span className="mt-2 block max-w-16 text-[10px] leading-tight text-neutral-700 dark:text-neutral-300">{item.name}</span>
          </button>
        ))}
      </div>
    </>
  );

  const stepRail = (
    <div className="relative flex items-center justify-between">
      <div className="absolute inset-x-4 top-1/2 z-0 border-t border-dashed border-neutral-300 dark:border-white/25" />
      {[1, 2, 3, 4].map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setStep(item as 1 | 2 | 3 | 4)}
          className={`relative z-10 grid size-9 place-items-center rounded-full border bg-white text-sm font-bold transition hover:scale-105 dark:bg-neutral-950 ${step === item ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950" : "border-neutral-300 text-neutral-600 dark:border-white/20 dark:text-neutral-300"}`}
        >
          {item}
        </button>
      ))}
    </div>
  );

  if (roomMode) {
    const uploadPane = (
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900">
        {roomPhoto ? (
          <div className="relative">
            <AppImage src={roomPhoto} alt="Uploaded room" className="aspect-[0.78/1] lg:aspect-[1.4/1]" sizes="(max-width: 1024px) 100vw, 720px" imageClassName="object-cover" />
            {aiGenerating ? (
              <div className="absolute inset-0 grid place-items-center bg-black/35 text-white">
                <div className="rounded-lg bg-neutral-950/80 px-5 py-4 text-center shadow-xl">
                  <SiteIcon name="fabric" className="mx-auto size-6 animate-pulse" />
                  <p className="mt-2 text-sm font-bold">Generating realistic room preview...</p>
                  <p className="mt-1 text-xs text-white/70">Blending sofa, fabric, and lighting</p>
                </div>
              </div>
            ) : null}
            {aiReady ? (
              <div className="absolute inset-x-4 bottom-4 rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur animate-in fade-in slide-in-from-bottom-2 dark:bg-neutral-950/90">
                <div className="grid grid-cols-[88px_1fr] gap-3">
                  <AppImage src={product.image} alt={product.name} className="aspect-[1.25/1] rounded-md" sizes="88px" />
                  <div>
                    <p className="font-bold">Looks perfect!</p>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{product.name} with {fabric.name}, {color.name}.</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <label className="grid min-h-80 cursor-pointer place-items-center border border-dashed border-neutral-300 p-8 text-center transition hover:border-neutral-500 dark:border-white/15 lg:min-h-[420px]">
            <span>
              <SiteIcon name="upload" className="mx-auto size-10" />
              <span className="mt-3 block font-bold">Upload room photo</span>
              <span className="mt-1 block text-xs text-neutral-500">JPG or PNG, taken from where the sofa will sit</span>
            </span>
            <input type="file" accept="image/*" className="sr-only" onChange={handleRoomUpload} />
          </label>
        )}
      </div>
    );

    const tips = (
      <div className="space-y-3 text-sm">
        {["Well-lit room", "Take from sofa perspective", "Clear the area"].map((tip) => (
          <p key={tip} className="flex items-center gap-2"><SiteIcon name="check" className="size-4 text-green-600" /> {tip}</p>
        ))}
      </div>
    );

    const roomActions = (
      <div className="space-y-3">
        {aiReady ? (
          <>
            <AppButton className="w-full" onClick={addDesignToCart}>Add to Cart</AppButton>
            <Link href="/showroom"><AppButton variant="outline" className="w-full">Talk to Designer</AppButton></Link>
            <AppButton variant="outline" className="w-full" onClick={() => { setRoomPhoto(null); setAiReady(false); setAiGenerating(false); }}>Try Another Photo</AppButton>
          </>
        ) : (
          <AppButton className="w-full" onClick={generateRoomPreview} disabled={!roomPhoto || aiGenerating} loading={aiGenerating}>Generate AI Result</AppButton>
        )}
      </div>
    );

    return (
      <div className="bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="mx-auto min-h-screen max-w-md px-4 py-8 lg:hidden">
          <button type="button" onClick={() => setRoomMode(false)} className="mb-5 text-sm font-bold">Back to customizer</button>
          <h1 className="text-2xl font-bold">See your sofa in your room</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Upload a photo of your space and preview how it looks.</p>
          <div className="mt-6">{uploadPane}</div>
          <div className="mt-6">{tips}</div>
          <p className="mt-10 text-center text-xs font-bold text-neutral-500">Powered by ShiputzAI</p>
          <div className="mt-6">{roomActions}</div>
        </div>

        <div className="mx-auto hidden min-h-screen w-full max-w-6xl px-8 py-12 lg:block">
          <button type="button" onClick={() => setRoomMode(false)} className="mb-6 text-sm font-bold">Back to customizer</button>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <h1 className="font-serif text-4xl font-bold">See your sofa in your room</h1>
              <p className="mt-3 max-w-xl text-neutral-600 dark:text-neutral-400">Upload a photo of your space and preview how {product.name} looks in {fabric.name}, {color.name}.</p>
              <div className="mt-8">{uploadPane}</div>
            </div>
            <aside className="sticky top-24 space-y-6 rounded-lg border border-neutral-200 p-6 dark:border-white/10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">Photo tips</p>
                <div className="mt-4">{tips}</div>
              </div>
              {roomActions}
              <p className="text-center text-xs font-bold text-neutral-500">Powered by ShiputzAI</p>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="mx-auto min-h-screen max-w-md px-4 py-8 lg:hidden">
        <div className="mb-8">{stepRail}</div>

        {step === 1 ? (
          <section>
            <h1 className="font-bold">Choose your model</h1>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">Select the model you want to customize</p>
            {modelPicker("mt-5 space-y-3")}
            <AppButton className="mt-8 w-full" onClick={() => setStep(2)}>Next</AppButton>
          </section>
        ) : null}

        {step === 2 ? (
          <section>
            <h1 className="font-bold">Choose size (width)</h1>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">All sizes are approximate</p>
            <div className="mt-8">{sizePicker}</div>
            <AppImage src={product.image} alt={product.name} className="mt-10 aspect-[1.4/1] rounded-lg" sizes="448px" imageClassName="object-contain" />
            <AppButton className="mt-8 w-full" onClick={() => setStep(3)}>Next</AppButton>
          </section>
        ) : null}

        {step === 3 ? (
          <section>
            <h1 className="font-bold">Choose fabric</h1>
            <div className="mt-5">{fabricPicker}</div>
            <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-white/10 dark:bg-neutral-900">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">Preview</p>
              <div className="mt-3 grid grid-cols-[84px_1fr] items-center gap-3">
                <AppImage src={product.image} alt={`${fabric.name} ${color.name} preview`} className="aspect-[1.2/1] rounded-md" sizes="84px" />
                <div>
                  <p className="font-bold">{fabric.name} in {color.name}</p>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">Soft rendered preview before review.</p>
                </div>
              </div>
            </div>
            <AppImage src={product.image} alt={product.name} className="mt-8 aspect-[0.9/1] rounded-lg" sizes="448px" />
            <AppButton className="mt-6 w-full" onClick={() => setStep(4)}>Next</AppButton>
          </section>
        ) : null}

        {step === 4 ? (
          <section>
            <h1 className="font-bold">Review your design</h1>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">Here is your custom sofa</p>
            <AppImage src={product.image} alt={product.name} className="mt-5 aspect-[1.2/1] rounded-lg" sizes="448px" />
            <div className="mt-5 space-y-3 text-sm">
              {summaryRows.map(([label, value]) => (
                <p key={label} className="flex justify-between"><span className="font-bold">{label}</span><span>{value}</span></p>
              ))}
            </div>
            <div className="mt-8 border-t border-neutral-200 pt-5 dark:border-white/10">
              <p className="text-sm font-bold">Total Price</p>
              <p className="font-serif text-3xl font-bold">{formatPrice(finalPrice)}</p>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">Estimated delivery: 21-28 days</p>
            </div>
            <AppButton className="mt-6 w-full" onClick={addDesignToCart}>Add to Cart</AppButton>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <AppButton variant="outline" onClick={saveDesign}>Save Design</AppButton>
              <AppButton variant="outline" onClick={shareDesign}>Share Design</AppButton>
            </div>
            <AppButton variant="outline" className="mt-3 w-full" onClick={() => setRoomMode(true)}>See It In My Room (AI)</AppButton>
          </section>
        ) : null}
      </div>

      <div className="mx-auto hidden min-h-screen w-full max-w-7xl px-8 py-12 lg:block">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Customize your sofa</p>
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
                <span className={step === item ? "" : "text-neutral-500"}>{stepLabels[item]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="sticky top-24 space-y-4">
            <AppImage src={product.image} alt={product.name} className="aspect-[1.35/1] rounded-lg border border-neutral-200 dark:border-white/10" sizes="820px" imageClassName="object-contain" />
            <div className="grid grid-cols-4 gap-3">
              {sofaProducts.slice(0, 4).map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => setProduct(item)}
                  className={`overflow-hidden rounded-md border transition hover:-translate-y-0.5 ${product.slug === item.slug ? "border-neutral-950 dark:border-white" : "border-neutral-200 dark:border-white/10"}`}
                >
                  <AppImage src={item.image} alt={item.name} className="aspect-[1.5/1]" sizes="180px" />
                </button>
              ))}
            </div>
          </div>

          <aside className="space-y-6 rounded-lg border border-neutral-200 p-6 dark:border-white/10">
            {step === 1 ? (
              <section>
                <h2 className="font-serif text-2xl font-bold">Choose your model</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Select the model you want to customize</p>
                {modelPicker("mt-6 grid grid-cols-2 gap-3")}
              </section>
            ) : null}

            {step === 2 ? (
              <section>
                <h2 className="font-serif text-2xl font-bold">Choose size (width)</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">All sizes are approximate</p>
                <div className="mt-6">{sizePicker}</div>
              </section>
            ) : null}

            {step === 3 ? (
              <section>
                <h2 className="font-serif text-2xl font-bold">Choose fabric and color</h2>
                <div className="mt-6">{fabricPicker}</div>
              </section>
            ) : null}

            {step === 4 ? (
              <section>
                <h2 className="font-serif text-2xl font-bold">Review your design</h2>
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
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-bold">Total Price</p>
                  <p className="font-serif text-3xl font-bold">{formatPrice(finalPrice)}</p>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Delivery 21-28 days</p>
              </div>

              {step < 4 ? (
                <AppButton className="mt-5 w-full" onClick={() => setStep((step + 1) as 1 | 2 | 3 | 4)}>Continue to {stepLabels[step + 1]}</AppButton>
              ) : (
                <>
                  <AppButton className="mt-5 w-full" onClick={addDesignToCart}>Add to Cart</AppButton>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <AppButton variant="outline" onClick={saveDesign}>Save Design</AppButton>
                    <AppButton variant="outline" onClick={shareDesign}>Share Design</AppButton>
                  </div>
                  <AppButton variant="outline" className="mt-3 w-full" onClick={() => setRoomMode(true)}>See It In My Room (AI)</AppButton>
                </>
              )}

              {step > 1 ? (
                <button type="button" onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)} className="mt-4 w-full text-sm font-bold text-neutral-600 underline dark:text-neutral-300">
                  Back to {stepLabels[step - 1]}
                </button>
              ) : null}
            </div>
          </aside>
        </div>
      </div>

      <AppDialog open={authOpen} onOpenChange={setAuthOpen} title="Save your sofa design" description="Create an account or sign in so this design appears in your Saved Designs panel.">
        <div className="space-y-4">
          <SocialAuthButtons callbackUrl="/customize-your-sofa" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/login?callbackUrl=/customize-your-sofa"><AppButton variant="outline" className="w-full">Sign In</AppButton></Link>
            <Link href="/register"><AppButton className="w-full">Create Account</AppButton></Link>
          </div>
        </div>
      </AppDialog>
    </div>
  );
}
