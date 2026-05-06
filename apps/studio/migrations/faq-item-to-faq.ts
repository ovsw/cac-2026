import { at, createIfNotExists, defineMigration, patch, set } from "sanity/migrate";

type SanityRecord = Record<string, unknown>;

type SanityReference = {
  _key?: string;
  _ref?: string;
  _type?: string;
};

type PortableTextBlock = SanityRecord & {
  _key?: string;
  _type?: string;
};

type LegacyFaqItemDocument = {
  _id: string;
  _type: "faqItem";
  answer?: PortableTextBlock[] | null;
  question?: string | null;
};

type FaqAccordionBlock = SanityRecord & {
  _key?: string;
  _type?: string;
  faqs?: SanityReference[];
};

type LegacyFaqSectionBlock = SanityRecord & {
  _key?: string;
  _type?: string;
  faqItems?: SanityReference[];
  title?: string | null;
};

type MigratableBlock = FaqAccordionBlock | LegacyFaqSectionBlock;

type MigratableDocument = {
  _id: string;
  _type: "page" | "reusableSection";
  pageBuilder?: MigratableBlock[];
  sections?: MigratableBlock[];
};

const FAQ_ID_PREFIX = "faq.";

function stripDraftPrefix(id: string): string {
  return id.replace(/^drafts\./, "");
}

function getTargetFaqId(sourceId: string): string {
  return `${FAQ_ID_PREFIX}${stripDraftPrefix(sourceId)}`;
}

function normalizePortableText(
  value?: PortableTextBlock[] | null
): PortableTextBlock[] | undefined {
  if (!Array.isArray(value) || value.length === 0) {
    return undefined;
  }

  return value.map((block) => ({ ...block }));
}

function mapReference(
  reference: SanityReference,
  legacyFaqIds: Set<string>
): SanityReference {
  if (!reference._ref || !legacyFaqIds.has(stripDraftPrefix(reference._ref))) {
    return reference;
  }

  return {
    ...reference,
    _ref: getTargetFaqId(reference._ref),
    _type: "reference",
  };
}

function migrateBlock(
  block: MigratableBlock,
  legacyFaqIds: Set<string>
): MigratableBlock {
  if (block._type === "legacyFaqSection") {
    const { faqItems, ...rest } = block as LegacyFaqSectionBlock;
    const faqs = Array.isArray(faqItems)
      ? faqItems.map((reference) => mapReference(reference, legacyFaqIds))
      : undefined;

    return {
      ...rest,
      _type: "faqAccordion",
      ...(faqs ? { faqs } : {}),
    };
  }

  if (block._type === "faqAccordion" && Array.isArray(block.faqs)) {
    return {
      ...block,
      faqs: block.faqs.map((reference) => mapReference(reference, legacyFaqIds)),
    };
  }

  return block;
}

function migrateBlocks(
  blocks: MigratableBlock[] | undefined,
  legacyFaqIds: Set<string>
): MigratableBlock[] | undefined {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return undefined;
  }

  let changed = false;
  const nextBlocks = blocks.map((block) => {
    const nextBlock = migrateBlock(block, legacyFaqIds);
    if (nextBlock !== block) {
      changed = true;
    }
    return nextBlock;
  });

  return changed ? nextBlocks : undefined;
}

export default defineMigration({
  title: "Cut over legacy faqItem content to faq documents and faqAccordion blocks",
  documentTypes: ["faqItem", "page", "reusableSection"],
  filter:
    '_type == "faqItem" || count(pageBuilder[_type == "legacyFaqSection"]) > 0 || count(sections[_type == "legacyFaqSection"]) > 0',
  async *migrate(_documents, context) {
    const client = context.client.withConfig({ perspective: "raw" });

    const legacyFaqItems = await client.fetch<LegacyFaqItemDocument[]>(
      `*[_type == "faqItem"]{
        _id,
        _type,
        question,
        answer
      }`
    );

    const contentDocuments = await client.fetch<MigratableDocument[]>(
      `*[
        _type in ["page", "reusableSection"] && (
          count(pageBuilder[_type == "legacyFaqSection"]) > 0 ||
          count(sections[_type == "legacyFaqSection"]) > 0
        )
      ]{
        _id,
        _type,
        pageBuilder,
        sections
      }`
    );

    const legacyFaqIds = new Set(
      legacyFaqItems.map((document) => stripDraftPrefix(document._id))
    );

    for (const legacyFaqItem of legacyFaqItems) {
      const richText = normalizePortableText(legacyFaqItem.answer);
      const title = legacyFaqItem.question?.trim();

      if (!title || !richText?.length) {
        continue;
      }

      yield createIfNotExists({
        _id: getTargetFaqId(legacyFaqItem._id),
        _type: "faq",
        title,
        richText,
      });
    }

    for (const document of contentDocuments) {
      const mutations = [];
      const nextPageBuilder = migrateBlocks(document.pageBuilder, legacyFaqIds);
      const nextSections = migrateBlocks(document.sections, legacyFaqIds);

      if (nextPageBuilder) {
        mutations.push(at("pageBuilder", set(nextPageBuilder)));
      }

      if (nextSections) {
        mutations.push(at("sections", set(nextSections)));
      }

      if (mutations.length > 0) {
        yield patch(document._id, mutations);
      }
    }
  },
});
