import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";
import { RichText } from "../elements/rich-text";
import { SanityIcon } from "../elements/sanity-icon";

type FeatureCardsWithIconProps = PagebuilderType<"featureCardsIcon">;

type FeatureCardProps = {
  card: NonNullable<FeatureCardsWithIconProps["cards"]>[number];
};

function FeatureCard({ card }: FeatureCardProps) {
  const { icon, title, richText } = card ?? {};
  return (
    <div className="brand-surface-forest rounded-3xl p-8 shadow-sm md:min-h-75 md:p-8">
      <span className="mb-9 flex w-fit items-center justify-center rounded-full bg-brand-sun p-3 text-brand-charcoal drop-shadow-xl">
        <SanityIcon icon={icon} />
      </span>

      <div>
        <h3 className="mb-2 font-medium text-lg text-primary-foreground md:text-2xl">
          {title}
        </h3>
        <RichText
          className="text-balance font-normal text-primary-foreground/85 text-sm leading-7 md:text-[16px]"
          richText={richText}
        />
      </div>
    </div>
  );
}

export function FeatureCardsWithIcon({
  eyebrow,
  title,
  richText,
  cards,
}: FeatureCardsWithIconProps) {
  return (
    <section className="my-6 md:my-16" id="features">
      <div className="container mx-auto px-4 md:px-6">
        <div className="px-4 py-12 md:px-8 md:py-16">
          <div className="flex w-full flex-col items-center">
            <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
              {eyebrow && (
                <Badge className="brand-kicker" variant="outline">
                  {eyebrow}
                </Badge>
              )}
              <h2 className="font-semibold text-3xl md:text-5xl">{title}</h2>
              <RichText
                className="max-w-3xl text-balance text-base md:text-lg"
                richText={richText}
              />
            </div>
          </div>
          <div className="mx-auto mt-20 grid gap-8 lg:grid-cols-3">
            {cards?.map((card, index) => (
              <FeatureCard
                card={card}
                key={`FeatureCard-${card?._key}-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
