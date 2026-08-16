import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AppLogoProps = {
  variant?: "auto" | "dark" | "light";
  className?: string;
  imageClassName?: string;
};

export function AppLogo({ variant = "auto", className, imageClassName }: AppLogoProps) {
  const src = variant === "light" ? "/shany_logo_white_ver1.png" : "/shany_logo_black_ver1.png";
  const imageClass = cn("h-auto w-32 object-contain sm:w-40", imageClassName);

  if (variant === "auto") {
    return (
      <Link href="/" className={cn("inline-flex items-center", className)} aria-label="SHANY Living home">
        <Image
          src="/shany_logo_black_ver1.png"
          alt="SHANY Living"
          width={180}
          height={58}
          preload
          className={cn(imageClass, "dark:hidden")}
        />
        <Image
          src="/shany_logo_white_ver1.png"
          alt="SHANY Living"
          width={180}
          height={58}
          className={cn(imageClass, "hidden dark:block")}
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={cn("inline-flex items-center", className)} aria-label="SHANY Living home">
      <Image
        src={src}
        alt="SHANY Living"
        width={180}
        height={58}
        preload
        className={imageClass}
      />
    </Link>
  );
}
