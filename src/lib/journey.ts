import type { SiteIconName } from "@/components/icons/SiteIcon";

export type JourneyStep = {
  key: string;
  icon: SiteIconName;
  href: string;
};

export type JourneyPhase = {
  key: "discover" | "customize" | "talk" | "own";
  steps: JourneyStep[];
};

export const journeyPhases: JourneyPhase[] = [
  {
    key: "discover",
    steps: [
      { key: "home", icon: "grid", href: "/" },
      { key: "collection", icon: "search", href: "/sofas" },
      { key: "product", icon: "sofa", href: "/sofas/lian-sofa" }
    ]
  },
  {
    key: "customize",
    steps: [
      { key: "model", icon: "move-3d", href: "/customize-your-sofa?step=model" },
      { key: "size", icon: "ruler", href: "/customize-your-sofa?step=size" },
      { key: "fabric", icon: "palette", href: "/customize-your-sofa?step=fabric" },
      { key: "review", icon: "check", href: "/customize-your-sofa?step=review" },
      { key: "room", icon: "image", href: "/customize-your-sofa?step=room" }
    ]
  },
  {
    key: "talk",
    steps: [
      { key: "whatsapp", icon: "message", href: "/contact" },
      { key: "consultation", icon: "phone", href: "/contact" },
      { key: "quote", icon: "mail", href: "/contact" }
    ]
  },
  {
    key: "own",
    steps: [
      { key: "payment", icon: "lock", href: "/checkout" },
      { key: "confirmed", icon: "award", href: "/order-confirmation" }
    ]
  }
];

export const journeySteps = journeyPhases.flatMap((phase) => phase.steps);

export const journeyStepNumber = (key: string) => journeySteps.findIndex((step) => step.key === key) + 1;

const socialSources = ["instagram", "ig", "facebook", "fb", "meta"];

export function isSocialArrival(value?: string | string[] | null) {
  const candidates = Array.isArray(value) ? value : [value];

  return candidates.some((candidate) => socialSources.includes(String(candidate ?? "").toLowerCase()));
}
