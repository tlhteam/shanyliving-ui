import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return <><AppHeader /><main>{children}</main><AppFooter /></>;
}
