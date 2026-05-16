import Image from "next/image";
import Link from "next/link";

import { cn } from "@workspace/ui/lib/utils";

import type { Maybe, SanityImageProps } from "@/types";
import { SanityImage } from "./elements/sanity-image";

const LOGO_URL =
  "https://cdn.sanity.io/images/s6kuy1ts/production/68c438f68264717e93c7ba1e85f1d0c4b58b33c2-1200x621.svg";

type LogoProps = {
  src?: Maybe<string>;
  darkSrc?: Maybe<string>;
  image?: Maybe<SanityImageProps>;
  darkImage?: Maybe<SanityImageProps>;
  alt?: Maybe<string>;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
};

export function Logo({
  src,
  darkSrc,
  alt = "logo",
  image,
  darkImage,
  width = 170,
  height = 40,
  priority = true,
  className,
}: LogoProps) {
  const hasDarkVariant = Boolean(darkImage || darkSrc);
  const baseAssetClassName = cn("block w-auto", className);

  return (
    <Link
      className="inline-flex shrink-0 items-center overflow-visible"
      href="/"
    >
      <LogoAsset
        alt={alt}
        className={
          hasDarkVariant
            ? cn(baseAssetClassName, "dark:hidden")
            : baseAssetClassName
        }
        height={height}
        image={image}
        priority={priority}
        src={src}
        width={width}
      />
      {hasDarkVariant ? (
        <LogoAsset
          alt={alt}
          className={cn("hidden w-auto dark:block", className)}
          height={height}
          image={darkImage}
          priority={priority}
          src={darkSrc}
          width={width}
        />
      ) : null}
    </Link>
  );
}

function LogoAsset({
  src,
  alt = "logo",
  image,
  width,
  height,
  priority,
  className,
}: LogoProps) {
  const asset = image ? (
    <SanityImage
      alt={alt ?? "logo"}
      className="rounded-none object-contain"
      decoding="sync"
      image={image}
      loading="eager"
      style={{ height, width: "auto" }}
    />
  ) : (
    <Image
      alt={alt ?? "logo"}
      className="rounded-none object-contain"
      decoding="sync"
      height={height}
      loading="eager"
      priority={priority}
      src={src ?? LOGO_URL}
      style={{ height, width: "auto" }}
      width={width}
    />
  );

  if (className) return <span className={className}>{asset}</span>;

  return asset;
}
