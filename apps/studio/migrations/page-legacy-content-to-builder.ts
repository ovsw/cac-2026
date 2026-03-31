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

type MigratedButton = {
  _key?: string;
  _type: "button";
  text?: string;
  variant: "default";
  url: {
    _type: "customUrl";
    type: "external";
    external: string;
    openInNewTab: false;
  };
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

function normalizeSlug(slug?: LegacySlug): LegacySlug | undefined {
  const current = slug?.current?.trim();

  if (!current) {
    return undefined;
  }

  return {
    _type: "slug",
    current: current.startsWith("/") ? current : `/${current}`,
  };
}

function normalizeLegacyUrl(url?: string): string | undefined {
  const value = url?.trim();

  if (!value) {
    return undefined;
  }

  if (
    value.startsWith("/") ||
    value.startsWith("#") ||
    value.startsWith("?")
  ) {
    return value;
  }

  try {
    return new URL(value).toString();
  } catch (_error) {
    return `/${value}`;
  }
}

function normalizeLegacyButton(button?: LegacyButton): MigratedButton | undefined {
  const text = button?.text?.trim();
  const external = normalizeLegacyUrl(button?.url);

  if (!text && !external) {
    return undefined;
  }

  return {
    _type: "button",
    ...(button?._key ? { _key: button._key } : {}),
    ...(text ? { text } : {}),
    variant: "default",
    url: {
      _type: "customUrl",
      type: "external",
      external: external ?? "#",
      openInNewTab: false,
    },
  };
}

function normalizeLegacyButtons(value: unknown): MigratedButton[] | undefined {
  if (Array.isArray(value)) {
    const buttons = value
      .map((button) => normalizeLegacyButton(button as LegacyButton))
      .filter(Boolean) as MigratedButton[];

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
      migratedSection.buttons = buttons;
    }
  }

  if (section._type === "ctaSection") {
    const buttons = normalizeLegacyButtons(section.button1);

    if (buttons) {
      migratedSection.buttons = buttons;
    }
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

      const normalizedSlug = normalizeSlug(legacyContent.slug);
      if (!page.slug?.current && normalizedSlug) {
        patches.push(at("slug", setIfMissing(normalizedSlug)));
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
