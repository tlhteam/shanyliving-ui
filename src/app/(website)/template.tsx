import { PageTransition } from "@/components/app/PageTransition";

export default function WebsiteTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
