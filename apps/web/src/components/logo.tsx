import Image from "next/image";
import Link from "next/link";

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
}: LogoProps) {
  const hasDarkVariant = Boolean(darkImage || darkSrc);

  return (
    <Link
      className="inline-flex shrink-0 items-center overflow-visible"
      href="/"
    >
      <LogoAsset
        alt={alt}
        className={hasDarkVariant ? "block w-auto dark:hidden" : "block w-auto"}
        height={height}
        image={image}
        priority={priority}
        src={src}
        width={width}
      />
      {hasDarkVariant && (
        <LogoAsset
          alt={alt}
          className="hidden w-auto dark:block"
          height={height}
          image={darkImage}
          priority={priority}
          src={darkSrc ?? src}
          width={width}
        />
      )}
    </Link>
  );
}

type LogoAssetProps = {
  src?: Maybe<string>;
  image?: Maybe<SanityImageProps>;
  alt?: Maybe<string>;
  width: number;
  height: number;
  priority: boolean;
  className?: string;
};

function LogoAsset({
  src,
  image,
  alt,
  width,
  height,
  priority,
  className,
}: LogoAssetProps) {
  const asset = image ? (
    <SanityImage
      alt={alt ?? "logo"}
      decoding="sync"
      image={image}
      loading="eager"
      style={{ height, width: "auto" }}
    />
  ) : (
    <Image
      alt={alt ?? "logo"}
      decoding="sync"
      height={height}
      loading="eager"
      priority={priority}
      src={src ?? LOGO_URL}
      style={{ height, width: "auto" }}
      width={width}
    />
  );

  if (className) {
    return <span className={className}>{asset}</span>;
  }

  if (image) {
    return asset;
  }

  return asset;
}
