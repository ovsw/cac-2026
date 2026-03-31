import { at, defineMigration, patch, set } from "sanity/migrate";

type SanityRecord = Record<string, unknown>;

type SanityReference = {
  _ref?: string;
  _type?: string;
};

type LegacyLinkMarkDef = SanityRecord & {
  _key?: string;
  _type?: string;
  href?: string;
};

type CustomUrlValue = {
  _type: "customUrl";
  type: "external" | "internal";
  external?: string;
  href: string;
  internal?: {
    _ref: string;
    _type: "reference";
  };
  openInNewTab: false;
};

type CustomLinkMarkDef = {
  _key?: string;
  _type: "customLink";
  customLink: CustomUrlValue;
};

type PortableTextBlock = SanityRecord & {
  _key?: string;
  _type?: string;
  markDefs?: Array<LegacyLinkMarkDef | CustomLinkMarkDef>;
};

type LegacySectionBlock = SanityRecord & {
  _key?: string;
  _type?: string;
  text?: PortableTextBlock[];
};

type PageLegacyContent = {
  sections?: LegacySectionBlock[];
};

type MigratableDocument = {
  _id: string;
  _type: "page" | "homePage" | "blogIndex" | "reusableSection";
  content?: PageLegacyContent;
  description?: PortableTextBlock[];
  pageBuilder?: LegacySectionBlock[];
  sections?: LegacySectionBlock[];
  title?: string;
  slug?: {
    current?: string;
  };
};

type LinkableDocument = {
  _id: string;
  _type: "blog" | "blogIndex" | "page";
  slug?: {
    current?: string;
  };
};

type LinkResolution =
  | {
      type: "internal";
      href: string;
      internal: {
        _ref: string;
        _type: "reference";
      };
    }
  | {
      type: "external";
      href: string;
      external: string;
      reason: "absolute" | "unmatched" | "ambiguous";
    };

type ReviewEntry = {
  reason: "unmatched" | "ambiguous";
  originalHref: string;
  normalizedHref: string;
  path: string;
};

type MigrationStats = {
  convertedLinks: number;
  internalLinks: number;
  unresolvedLinks: number;
  reviewEntries: ReviewEntry[];
};

const LINKABLE_DOCUMENT_TYPES = ["blog", "blogIndex", "page"] as const;

function stripDraftPrefix(id: string): string {
  return id.replace(/^drafts\./, "");
}

function normalizeLegacyHref(href?: string): string | undefined {
  const value = href?.trim();

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

function canonicalizeInternalPath(path: string): string {
  if (path === "/") {
    return path;
  }

  return path.endsWith("/") ? path.slice(0, -1) : path;
}

function buildSlugLookup(documents: LinkableDocument[]): Map<string, string[]> {
  const lookup = new Map<string, Set<string>>();

  for (const document of documents) {
    const slug = document.slug?.current?.trim();

    if (!slug) {
      continue;
    }

    const normalizedPath = canonicalizeInternalPath(
      slug.startsWith("/") ? slug : `/${slug}`
    );
    const ids = lookup.get(normalizedPath) ?? new Set<string>();
    ids.add(stripDraftPrefix(document._id));
    lookup.set(normalizedPath, ids);
  }

  return new Map(
    Array.from(lookup.entries()).map(([path, ids]) => [path, Array.from(ids)])
  );
}

function resolveLink(
  href: string,
  slugLookup: Map<string, string[]>
): LinkResolution {
  const isAbsoluteUrl = /^[a-z][a-z0-9+.-]*:\/\//i.test(href);

  if (isAbsoluteUrl) {
    return {
      type: "external",
      href,
      external: href,
      reason: "absolute",
    };
  }

  const matches = slugLookup.get(canonicalizeInternalPath(href)) ?? [];

  if (matches.length === 1) {
    return {
      type: "internal",
      href,
      internal: {
        _ref: matches[0]!,
        _type: "reference",
      },
    };
  }

  return {
    type: "external",
    href,
    external: href,
    reason: matches.length > 1 ? "ambiguous" : "unmatched",
  };
}

function migrateMarkDef(
  markDef: LegacyLinkMarkDef | CustomLinkMarkDef,
  slugLookup: Map<string, string[]>,
  stats: MigrationStats,
  path: string
): LegacyLinkMarkDef | CustomLinkMarkDef {
  if (markDef._type !== "link") {
    return markDef;
  }

  const originalHref = markDef.href?.trim() || "#";
  const normalizedHref = normalizeLegacyHref(markDef.href) ?? "#";
  const resolvedLink = resolveLink(normalizedHref, slugLookup);

  stats.convertedLinks += 1;

  if (resolvedLink.type === "internal") {
    stats.internalLinks += 1;
    return {
      _key: markDef._key,
      _type: "customLink",
      customLink: {
        _type: "customUrl",
        type: "internal",
        href: resolvedLink.href,
        internal: resolvedLink.internal,
        openInNewTab: false,
      },
    };
  }

  if (resolvedLink.reason !== "absolute") {
    stats.unresolvedLinks += 1;
    stats.reviewEntries.push({
      reason: resolvedLink.reason,
      originalHref,
      normalizedHref,
      path,
    });
  }

  return {
    _key: markDef._key,
    _type: "customLink",
    customLink: {
      _type: "customUrl",
      type: "external",
      external: resolvedLink.external,
      href: resolvedLink.href,
      openInNewTab: false,
    },
  };
}

function migratePortableText(
  blocks: PortableTextBlock[] | undefined,
  slugLookup: Map<string, string[]>,
  stats: MigrationStats,
  pathPrefix: string
): PortableTextBlock[] | undefined {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return undefined;
  }

  let changed = false;

  const nextBlocks = blocks.map((block, blockIndex) => {
    if (block._type !== "block" || !Array.isArray(block.markDefs)) {
      return block;
    }

    let blockChanged = false;
    const nextMarkDefs = block.markDefs.map((markDef, markIndex) => {
      const markPath = `${pathPrefix}[${blockIndex}].markDefs[${
        markDef._key ? `_key==\"${markDef._key}\"` : markIndex
      }]`;
      const nextMarkDef = migrateMarkDef(markDef, slugLookup, stats, markPath);
      if (nextMarkDef !== markDef) {
        blockChanged = true;
      }
      return nextMarkDef;
    });

    if (!blockChanged) {
      return block;
    }

    changed = true;

    return {
      ...block,
      markDefs: nextMarkDefs,
    };
  });

  return changed ? nextBlocks : undefined;
}

function migrateSectionBlocks(
  blocks: LegacySectionBlock[] | undefined,
  slugLookup: Map<string, string[]>,
  stats: MigrationStats,
  pathPrefix: string
): LegacySectionBlock[] | undefined {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return undefined;
  }

  let changed = false;

  const nextBlocks = blocks.map((block, blockIndex) => {
    const nextText = migratePortableText(
      block.text,
      slugLookup,
      stats,
      `${pathPrefix}[${blockIndex}].text`
    );

    if (!nextText) {
      return block;
    }

    changed = true;

    return {
      ...block,
      text: nextText,
    };
  });

  return changed ? nextBlocks : undefined;
}

function getDocumentLabel(document: MigratableDocument): string {
  const slug = document.slug?.current?.trim();
  const title = document.title?.trim();

  if (title && slug) {
    return `${title} (${slug})`;
  }

  if (title) {
    return title;
  }

  if (slug) {
    return slug;
  }

  return stripDraftPrefix(document._id);
}

function formatReviewReport(
  documents: Array<{
    document: MigratableDocument;
    entries: ReviewEntry[];
  }>
): string | undefined {
  if (documents.length === 0) {
    return undefined;
  }

  const lines = [
    "[legacy-portable-text-links-to-custom-links] Manual review report:",
  ];

  for (const { document, entries } of documents) {
    lines.push(
      `- ${getDocumentLabel(document)} [${document._type}] (${entries.length} link${
        entries.length === 1 ? "" : "s"
      })`
    );

    for (const entry of entries) {
      lines.push(
        `  • ${entry.reason === "ambiguous" ? "Ambiguous match" : "No internal match"} at ${entry.path}`
      );
      lines.push(`    original: ${entry.originalHref}`);
      lines.push(`    normalized: ${entry.normalizedHref}`);
    }
  }

  return lines.join("\n");
}

export default defineMigration({
  title: "Convert legacy portable text links to customLink/customUrl",
  documentTypes: ["page", "homePage", "blogIndex", "reusableSection"],
  filter:
    'defined(pageBuilder) || defined(content.sections) || defined(sections) || defined(description)',
  async *migrate(_documents, context) {
    const client = context.client.withConfig({ perspective: "raw" });

    const linkableDocuments = await client.fetch<LinkableDocument[]>(
      `*[_type in $types && defined(slug.current)]{
        _id,
        _type,
        slug
      }`,
      {
        types: [...LINKABLE_DOCUMENT_TYPES],
      }
    );

    const slugLookup = buildSlugLookup(linkableDocuments);

    const contentDocuments = await client.fetch<MigratableDocument[]>(
      `*[
        _type in ["page", "homePage", "blogIndex", "reusableSection"] && (
          defined(pageBuilder) ||
          defined(content.sections) ||
          defined(sections) ||
          defined(description)
        )
      ]{
        _id,
        _type,
        pageBuilder,
        content,
        sections,
        description,
        title,
        slug
      }`
    );

    let convertedLinks = 0;
    let internalLinks = 0;
    let unresolvedLinks = 0;
    const reviewDocuments: Array<{
      document: MigratableDocument;
      entries: ReviewEntry[];
    }> = [];

    for (const document of contentDocuments) {
      const stats: MigrationStats = {
        convertedLinks: 0,
        internalLinks: 0,
        unresolvedLinks: 0,
        reviewEntries: [],
      };
      const mutations = [];

      const nextPageBuilder = migrateSectionBlocks(
        document.pageBuilder,
        slugLookup,
        stats,
        "pageBuilder"
      );
      const nextContentSections = migrateSectionBlocks(
        document.content?.sections,
        slugLookup,
        stats,
        "content.sections"
      );
      const nextSections = migrateSectionBlocks(
        document.sections,
        slugLookup,
        stats,
        "sections"
      );
      const nextDescription = migratePortableText(
        document.description,
        slugLookup,
        stats,
        "description"
      );

      if (nextPageBuilder) {
        mutations.push(at("pageBuilder", set(nextPageBuilder)));
      }

      if (nextContentSections) {
        mutations.push(at("content.sections", set(nextContentSections)));
      }

      if (nextSections) {
        mutations.push(at("sections", set(nextSections)));
      }

      if (nextDescription) {
        mutations.push(at("description", set(nextDescription)));
      }

      if (mutations.length > 0) {
        convertedLinks += stats.convertedLinks;
        internalLinks += stats.internalLinks;
        unresolvedLinks += stats.unresolvedLinks;
        if (stats.reviewEntries.length > 0) {
          reviewDocuments.push({
            document,
            entries: stats.reviewEntries,
          });
        }

        yield patch(document._id, mutations);
      }
    }

    const summaryLines = [
      `[legacy-portable-text-links-to-custom-links] Converted links: ${convertedLinks}`,
      `[legacy-portable-text-links-to-custom-links] Auto-resolved internal links: ${internalLinks}`,
      `[legacy-portable-text-links-to-custom-links] Unresolved or ambiguous links for manual review: ${unresolvedLinks}`,
      `[legacy-portable-text-links-to-custom-links] Documents with manual-review items: ${reviewDocuments.length}`,
    ];
    const reviewReport = formatReviewReport(reviewDocuments);

    console.log(
      reviewReport
        ? [...summaryLines, "", reviewReport].join("\n")
        : summaryLines.join("\n")
    );
  },
});
