import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

import type { PagebuilderType } from "@/types";
import { SanityImage } from "./elements/sanity-image";

type ImageLinkCard = NonNullable<
  NonNullable<PagebuilderType<"imageLinkCards">["cards"]>
>[number];

export type CTACardProps = {
  card: ImageLinkCard;
  className?: string;
};

export function CTACard({ card, className }: CTACardProps) {
  const { image, description, title, href } = card ?? {};
  return (
    <Link
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-3xl p-4 text-primary-foreground transition-colors md:p-8 xl:h-[400px]",
        className
      )}
      href={href ?? "#"}
    >
      {image?.id && (
        <>
          <div className="absolute inset-0 z-0">
            <SanityImage
              className="pointer-events-none h-full object-cover opacity-35 grayscale duration-700 group-hover:opacity-60 group-hover:grayscale-0 group-hover:transition-opacity"
              height={1080}
              image={image}
              loading="eager"
              width={1920}
            />
          </div>
          <div className="absolute inset-0 z-1 bg-gradient-to-t from-primary via-primary/80 to-primary/30" />
        </>
      )}
      <div className="z-2 mb-4 flex flex-col space-y-2 pt-64 duration-500 group-hover:top-8 xl:absolute xl:inset-x-8 xl:top-24">
        <h3 className="font-medium text-primary-foreground text-xl">{title}</h3>
        <p className="text-primary-foreground/85 text-sm transition-opacity delay-150 duration-300 xl:opacity-0 xl:group-hover:opacity-100">
          {description}
        </p>
      </div>
    </Link>
  );
}
