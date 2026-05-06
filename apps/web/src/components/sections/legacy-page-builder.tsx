import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

import type { PagebuilderType } from "@/types";
import { RichText } from "../elements/rich-text";
import { SanityButtons } from "../elements/sanity-buttons";
import { SanityImage } from "../elements/sanity-image";

type LegacyMagSectionProps = PagebuilderType<"legacyMagSection">;
type LegacyCtaSectionProps = PagebuilderType<"legacyCtaSection">;
type LegacyBigHeadingProps = PagebuilderType<"legacyBigHeading">;
type LegacyFaqSectionProps = PagebuilderType<"legacyFaqSection">;
type LegacyTestimonialSectionProps =
  PagebuilderType<"legacyTestimonialSection">;
type LegacyTestimonialsSectionProps =
  PagebuilderType<"legacyTestimonialsSection">;
type LegacyReusedSectionProps = PagebuilderType<"legacyReusedSection">;

type LegacyMagazineSectionProps = LegacyMagSectionProps & {
  readonly blockIndex?: number;
};

function LegacyShell({
  title,
  subtitle,
  children,
  eyebrow,
}: {
  title?: string | null;
  subtitle?: string | null;
  eyebrow?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <section className="my-6 md:my-16">
      <div className="container mx-auto grid gap-6 px-4 md:px-6">
        <div className="space-y-3">
          {eyebrow ? <Badge variant="secondary">{eyebrow}</Badge> : null}
          {title ? (
            <h2 className="font-semibold text-3xl md:text-5xl">{title}</h2>
          ) : null}
          {subtitle ? (
            <p className="text-muted-foreground text-lg">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function LegacyMagSectionBlock({
  title,
  subtitle,
  eyebrow,
  text,
  image,
  buttons,
  blockIndex = 0,
}: LegacyMagazineSectionProps) {
  const isImageFirst = blockIndex % 2 !== 0;
  const hasAlternateBackground = blockIndex % 2 === 0;
  const mediaBreakoutClass = isImageFirst
    ? "xl:-ml-[calc(50vw-50%)]"
    : "xl:-mr-[calc(50vw-50%)]";
  const contentSpacingClass = isImageFirst ? "xl:pl-10" : "xl:pr-10";

  return (
    <section
      className={cn(
        "relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-12 md:py-20",
        hasAlternateBackground
          ? "bg-black/[0.045] dark:bg-white/[0.06]"
          : "bg-background"
      )}
    >
      <div className="container mx-auto max-w-[76.5rem] px-4 md:px-6">
        <div
          className={cn(
            "grid grid-cols-1 items-center gap-10 xl:grid-cols-2 xl:items-stretch xl:gap-0",
            isImageFirst && image ? "xl:[&>*:first-child]:order-2" : ""
          )}
        >
          <div className={contentSpacingClass}>
            <div className="mx-auto flex w-full max-w-[52.5rem] flex-col items-start justify-center gap-8 xl:max-w-full">
              <div className="flex max-w-[42rem] flex-col items-start gap-6 xl:max-w-full">
                {eyebrow ? (
                  <Badge
                    className="rounded-md px-[0.625rem] py-1 font-mono text-xs uppercase"
                    variant="secondary"
                  >
                    {eyebrow}
                  </Badge>
                ) : null}
                {title ? (
                  <h2 className="text-balance text-4xl leading-none font-semibold tracking-tighter text-foreground md:text-7xl">
                    {title}
                  </h2>
                ) : null}
                {subtitle ? (
                  <p className="max-w-[42rem] text-base leading-snug text-foreground md:text-lg">
                    {subtitle}
                  </p>
                ) : null}
                {text?.length ? (
                  <RichText
                    className="max-w-[42rem] text-muted-foreground text-sm md:text-base"
                    richText={text}
                  />
                ) : null}
              </div>

              <SanityButtons
                buttonClassName="h-fit w-full rounded-xl px-5 py-3 text-[0.9375rem] leading-normal font-medium sm:w-auto"
                buttons={buttons ?? null}
                className="w-full items-stretch gap-4 md:flex-row md:items-center"
              />
            </div>
          </div>

          {image ? (
            <div className="flex xl:h-full xl:items-stretch">
              <div
                className={cn(
                  "border-muted2 w-full overflow-hidden rounded-[1.25rem] border md:w-[63.4375rem] xl:max-w-none",
                  mediaBreakoutClass
                )}
              >
                <div className="relative aspect-[1.5378787878787878] xl:h-full xl:min-h-[42rem] xl:aspect-auto">
                  <SanityImage
                    className="absolute inset-0 !h-full !w-full object-cover object-center"
                    fetchPriority={blockIndex === 0 ? "high" : "low"}
                    height={900}
                    image={image}
                    loading="eager"
                    width={1384}
                  />
                  <div className="absolute top-0 left-0 z-20 h-[0.125rem] w-full">
                    <div className="absolute h-full w-[20%] animate-slide-to-right bg-[linear-gradient(270deg,var(--color-primary)_0%,var(--color-transparent)_85%)] md:w-[14%]" />
                  </div>
                  <div className="absolute bottom-0 left-0 z-20 h-full w-[0.125rem]">
                    <div className="absolute h-[24%] w-full animate-slide-to-top bg-[linear-gradient(180deg,var(--color-primary)_0%,var(--color-transparent)_85%)] md:h-[17%]" />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function LegacyCtaSectionBlock({
  title,
  subtitle,
}: LegacyCtaSectionProps) {
  return (
    <LegacyShell subtitle={subtitle} title={title}>
      <div className="rounded-3xl bg-muted p-6 text-muted-foreground text-sm">
        Legacy CTA copy and button data were preserved in this migrated block
        and need a dedicated frontend pass.
      </div>
    </LegacyShell>
  );
}

export function LegacyBigHeadingBlock({ title }: LegacyBigHeadingProps) {
  return (
    <LegacyShell title={title}>
      <div />
    </LegacyShell>
  );
}

export function LegacyFaqSectionBlock({
  title,
  faqItems,
}: LegacyFaqSectionProps) {
  return (
    <LegacyShell
      subtitle={
        faqItems?.length
          ? `${faqItems.length} legacy FAQ references`
          : "Legacy FAQ references"
      }
      title={title}
    >
      <div className="text-muted-foreground text-sm">
        This block was migrated from the legacy CAC model and still needs a
        dedicated frontend rendering pass.
      </div>
    </LegacyShell>
  );
}

export function LegacyTestimonialSectionBlock({
  title,
  testimonial,
}: LegacyTestimonialSectionProps) {
  return (
    <LegacyShell title={title}>
      <blockquote className="rounded-3xl bg-muted p-6">
        <p className="text-lg italic">{testimonial?.text}</p>
        {testimonial?.author ? (
          <footer className="mt-3 text-muted-foreground text-sm">
            {testimonial.author}
          </footer>
        ) : null}
      </blockquote>
    </LegacyShell>
  );
}

export function LegacyTestimonialsSectionBlock({
  title,
  testimonialsList,
}: LegacyTestimonialsSectionProps) {
  return (
    <LegacyShell title={title}>
      <div className="grid gap-4 md:grid-cols-2">
        {testimonialsList?.map((testimonial) => (
          <blockquote
            className="rounded-3xl bg-muted p-6"
            key={testimonial?._id}
          >
            <p className="text-base italic">{testimonial?.text}</p>
            {testimonial?.author ? (
              <footer className="mt-3 text-muted-foreground text-sm">
                {testimonial.author}
              </footer>
            ) : null}
          </blockquote>
        ))}
      </div>
    </LegacyShell>
  );
}

export function LegacyReusedSectionBlock({
  reusableSection,
}: LegacyReusedSectionProps) {
  return (
    <LegacyShell
      subtitle="Legacy reusable section reference"
      title={reusableSection?.title}
    >
      <div className="text-muted-foreground text-sm">
        This migrated block points at a legacy reusable section document and can
        be consolidated in a later cleanup pass.
      </div>
    </LegacyShell>
  );
}
