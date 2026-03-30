import { at, defineMigration, setIfMissing } from "sanity/migrate";

type SanityRecord = Record<string, unknown>;

type SanityImage = {
  _type?: string;
  alt?: string;
  asset?: unknown;
  crop?: unknown;
  hotspot?: unknown;
};

type LegacyButton = {
  _key?: string;
  _type?: string;
  text?: string;
  url?: string;
};

type LegacySlug = {
  _type?: "slug";
  current?: string;
};

type LegacySeo = {
  title?: string;
  description?: string;
  image?: SanityImage;
};

type LegacySection = SanityRecord & {
  _key?: string;
  _type?: string;
};

type LegacyContent = {
  title?: string;
  slug?: LegacySlug;
  headerImage?: SanityImage;
  seo?: LegacySeo;
  sections?: LegacySection[];
};

type PageDocument = SanityRecord & {
  title?: string;
  description?: string;
  slug?: LegacySlug;
  image?: SanityImage;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: SanityImage;
  pageBuilder?: unknown[];
  content?: LegacyContent;
};

const builderTypeMap: Record<string, string> = {
  magSection: "legacyMagSection",
  ctaSection: "legacyCtaSection",
  bigHeading: "legacyBigHeading",
  faqSection: "legacyFaqSection",
  testimonialSection: "legacyTestimonialSection",
  testimonialsSection: "legacyTestimonialsSection",
  reusedSection: "legacyReusedSection",
};

function normalizeImage(image?: SanityImage): SanityImage | undefined {
  if (!image?.asset) {
    return undefined;
  }

  return {
    _type: "image",
    alt: image.alt,
    asset: image.asset,
    crop: image.crop,
    hotspot: image.hotspot,
  };
}

function normalizeLegacyButton(button?: LegacyButton): LegacyButton | undefined {
  if (!button?.text && !button?.url) {
    return undefined;
  }

  return {
    _type: "legacyButton",
    ...(button._key ? { _key: button._key } : {}),
    ...(button.text ? { text: button.text } : {}),
    ...(button.url ? { url: button.url } : {}),
  };
}

function normalizeLegacyButtons(value: unknown): LegacyButton[] | undefined {
  if (Array.isArray(value)) {
    const buttons = value
      .map((button) => normalizeLegacyButton(button as LegacyButton))
      .filter(Boolean) as LegacyButton[];

    return buttons.length ? buttons : undefined;
  }

  const button = normalizeLegacyButton(value as LegacyButton);
  return button ? [button] : undefined;
}

function migrateSection(section: LegacySection): SanityRecord {
  const nextType = builderTypeMap[section._type ?? ""] ?? section._type;
  const migratedSection: SanityRecord = {
    ...section,
    _type: nextType,
  };

  if (section._type === "magSection") {
    const buttons = normalizeLegacyButtons(section.button1);

    if (buttons) {
      migratedSection.button1 = buttons;
    }
  }

  if (section._type === "ctaSection") {
    const buttons = normalizeLegacyButtons(section.button1);
    migratedSection.button1 = buttons?.[0];
  }

  return migratedSection;
}

export default defineMigration({
  title: "Compat-first page migration from legacy content to page builder",
  documentTypes: ["page"],
  filter: "defined(content.sections)",
  migrate: {
    document(document) {
      const page = document as PageDocument;
      const legacyContent = page.content;

      if (!legacyContent?.sections?.length && !legacyContent?.title) {
        return;
      }

      const patches = [];

      if (!page.title && legacyContent.title) {
        patches.push(at("title", setIfMissing(legacyContent.title)));
      }

      if (!page.slug?.current && legacyContent.slug?.current) {
        patches.push(at("slug", setIfMissing(legacyContent.slug)));
      }

      const normalizedHeaderImage = normalizeImage(legacyContent.headerImage);
      if (!page.image?.asset && normalizedHeaderImage) {
        patches.push(at("image", setIfMissing(normalizedHeaderImage)));
      }

      if (!page.seoTitle && legacyContent.seo?.title) {
        patches.push(at("seoTitle", setIfMissing(legacyContent.seo.title)));
      }

      if (!page.seoDescription && legacyContent.seo?.description) {
        patches.push(
          at("seoDescription", setIfMissing(legacyContent.seo.description))
        );
      }

      const normalizedSeoImage = normalizeImage(legacyContent.seo?.image);
      if (!page.seoImage?.asset && normalizedSeoImage) {
        patches.push(at("seoImage", setIfMissing(normalizedSeoImage)));
      }

      if (!page.pageBuilder?.length && legacyContent.sections?.length) {
        patches.push(
          at(
            "pageBuilder",
            setIfMissing(legacyContent.sections.map((section) => migrateSection(section)))
          )
        );
      }

      return patches.length ? patches : undefined;
    },
  },
});
