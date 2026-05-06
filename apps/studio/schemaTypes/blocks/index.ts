import { cta } from "@/schemaTypes/blocks/cta";
import { faqAccordion } from "@/schemaTypes/blocks/faq-accordion";
import { featureCardsIcon } from "@/schemaTypes/blocks/feature-cards-icon";
import { hero } from "@/schemaTypes/blocks/hero";
import { imageLinkCards } from "@/schemaTypes/blocks/image-link-cards";
import { legacyBigHeading } from "@/schemaTypes/blocks/legacy-big-heading";
import { legacyCtaSection } from "@/schemaTypes/blocks/legacy-cta-section";
import { legacyFaqSection } from "@/schemaTypes/blocks/legacy-faq-section";
import { legacyMagSection } from "@/schemaTypes/blocks/legacy-mag-section";
import { legacyReusedSection } from "@/schemaTypes/blocks/legacy-reused-section";
import { legacyTestimonialSection } from "@/schemaTypes/blocks/legacy-testimonial-section";
import { legacyTestimonialsSection } from "@/schemaTypes/blocks/legacy-testimonials-section";
import { longRichTextSection } from "@/schemaTypes/blocks/long-rich-text-section";
import { reusableSectionReference } from "@/schemaTypes/blocks/reusable-section-reference";
import { richTextBlock } from "@/schemaTypes/blocks/rich-text";
import { subscribeNewsletter } from "@/schemaTypes/blocks/subscribe-newsletter";

export const pageBuilderBlocks = [
  hero,
  cta,
  featureCardsIcon,
  faqAccordion,
  imageLinkCards,
  richTextBlock,
  longRichTextSection,
  subscribeNewsletter,
  reusableSectionReference,
  legacyMagSection,
  legacyCtaSection,
  legacyBigHeading,
  legacyFaqSection,
  legacyTestimonialSection,
  legacyTestimonialsSection,
  legacyReusedSection,
];
