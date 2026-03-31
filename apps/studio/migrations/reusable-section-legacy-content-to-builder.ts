import { at, defineMigration, setIfMissing } from "sanity/migrate";

type SanityRecord = Record<string, unknown>;

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

type LegacySection = SanityRecord & {
  _key?: string;
  _type?: string;
};

type ReusableSectionDocument = SanityRecord & {
  pageBuilder?: unknown[];
  sections?: LegacySection[];
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
  title:
    "Backfill reusableSection.pageBuilder from legacy sections for reusable section documents",
  documentTypes: ["reusableSection"],
  filter: "defined(sections) && count(sections) > 0",
  migrate: {
    document(document) {
      const reusableSection = document as ReusableSectionDocument;

      if (reusableSection.pageBuilder?.length || !reusableSection.sections?.length) {
        return;
      }

      return [
        at(
          "pageBuilder",
          setIfMissing(
            reusableSection.sections.map((section) => migrateSection(section))
          )
        ),
      ];
    },
  },
});
