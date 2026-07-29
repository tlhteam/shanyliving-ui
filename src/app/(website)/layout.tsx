import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-white text-neutral-950"><AppHeader /><main>{children}</main><AppFooter /></div>;
}
