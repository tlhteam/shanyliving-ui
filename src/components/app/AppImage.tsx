import Image from "next/image";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export type AppImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  quality?: number;
  preload?: boolean;
  loading?: "eager" | "lazy";
  objectPosition?: string;
};

export function AppImage({
  src,
  alt,
  className,
  imageClassName,
  sizes = "100vw",
  quality,
  preload,
  loading,
  objectPosition
}: AppImageProps) {
  const resolvedSrc = mediaUrl(src);
  const usesNativeImage = resolvedSrc?.startsWith("data:") || resolvedSrc?.startsWith("blob:");

  return (
    <div className={cn("relative overflow-hidden bg-[linear-gradient(135deg,#f7f3ec,#e4ddd2_48%,#f7f7f5)]", className)}>
      {resolvedSrc && usesNativeImage ? (
        <div
          role="img"
          aria-label={alt}
          style={{
            backgroundImage: `url(${resolvedSrc})`,
            backgroundPosition: objectPosition ?? "center"
          }}
          className={cn("h-full w-full bg-cover bg-center", imageClassName)}
        />
      ) : resolvedSrc ? (
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          preload={preload}
          loading={loading}
          style={objectPosition ? { objectPosition } : undefined}
          className={cn("object-cover", imageClassName)}
        />
      ) : null}
    </div>
  );
}
