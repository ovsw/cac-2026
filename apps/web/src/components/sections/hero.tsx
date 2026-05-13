import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";
import { RichText } from "../elements/rich-text";
import { SanityButtons } from "../elements/sanity-buttons";
import { SanityImage } from "../elements/sanity-image";

type HeroBlockProps = PagebuilderType<"hero">;

export function HeroBlock({
  title,
  buttons,
  badge,
  image,
  richText,
}: HeroBlockProps) {
  return (
    <section className="mt-4 md:my-16" id="hero">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          <div className="brand-surface-forest grid h-full grid-rows-[auto_1fr_auto] items-center justify-items-center gap-6 rounded-3xl p-8 text-center shadow-sm md:p-10 lg:items-start lg:justify-items-start lg:p-12 lg:text-left">
            {badge && (
              <Badge className="brand-kicker" variant="outline">
                {badge}
              </Badge>
            )}
            <div className="grid gap-4">
              <h1 className="text-balance font-semibold text-4xl lg:text-6xl">
                {title}
              </h1>
              <RichText
                className="font-normal text-base text-primary-foreground/90 md:text-lg"
                richText={richText}
              />
            </div>
            <SanityButtons
              buttonClassName="w-full sm:w-auto"
              buttons={buttons}
              className="mb-8 grid w-full gap-2 sm:w-fit sm:grid-flow-col lg:justify-start"
            />
          </div>

          {image && (
            <div className="h-96 w-full">
              <SanityImage
                className="h-full max-h-96 w-full rounded-3xl object-cover"
                fetchPriority="high"
                height={800}
                image={image}
                loading="eager"
                width={800}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
