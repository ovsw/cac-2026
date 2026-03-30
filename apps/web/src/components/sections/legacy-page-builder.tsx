import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";

type LegacyMagSectionProps = PagebuilderType<"legacyMagSection">;
type LegacyCtaSectionProps = PagebuilderType<"legacyCtaSection">;
type LegacyBigHeadingProps = PagebuilderType<"legacyBigHeading">;
type LegacyFaqSectionProps = PagebuilderType<"legacyFaqSection">;
type LegacyTestimonialSectionProps =
  PagebuilderType<"legacyTestimonialSection">;
type LegacyTestimonialsSectionProps =
  PagebuilderType<"legacyTestimonialsSection">;
type LegacyReusedSectionProps = PagebuilderType<"legacyReusedSection">;

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
  image,
}: LegacyMagSectionProps) {
  return (
    <LegacyShell eyebrow={eyebrow} subtitle={subtitle} title={title}>
      <div className="rounded-3xl bg-muted p-6 text-muted-foreground text-sm">
        {image?.asset
          ? "Legacy image and portable-text content were preserved in the migrated block and need a dedicated frontend pass."
          : "Legacy portable-text content was preserved in the migrated block and needs a dedicated frontend pass."}
      </div>
    </LegacyShell>
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
