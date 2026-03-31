import { at, defineMigration, setIfMissing } from "sanity/migrate";

type SanityRecord = Record<string, unknown>;

type LegacyButton = {
  _key?: string;
  _type?: string;
  text?: string;
  url?: string;
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
