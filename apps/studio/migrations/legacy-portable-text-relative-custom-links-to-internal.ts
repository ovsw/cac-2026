import { at, defineMigration, patch, set } from "sanity/migrate";

type SanityRecord = Record<string, unknown>;

type CustomUrlValue = {
  _type?: "customUrl";
  type?: "external" | "internal";
  external?: string;
  href?: string;
  internal?: {
    _ref?: string;
    _type?: "reference";
  };
  openInNewTab?: boolean;
};

type CustomLinkMarkDef = SanityRecord & {
  _key?: string;
  _type?: string;
  customLink?: CustomUrlValue;
};

type PortableTextBlock = SanityRecord & {
  _key?: string;
  _type?: string;
  markDefs?: CustomLinkMarkDef[];
};

type LegacySectionBlock = SanityRecord & {
  _key?: string;
  _type?: string;
  text?: PortableTextBlock[];
};

type MigratableDocument = {
  _id: string;
  _type: "page" | "homePage" | "blogIndex" | "reusableSection";
  title?: string;
  slug?: {
    current?: string;
  };
  description?: PortableTextBlock[];
  pageBuilder?: LegacySectionBlock[];
  content?: {
    sections?: LegacySectionBlock[];
  };
  sections?: LegacySectionBlock[];
};

type LinkableDocument = {
  _id: string;
  _type: "blog" | "blogIndex" | "page";
  slug?: {
    current?: string;
  };
};

type ReviewEntry = {
  href: string;
  normalizedHref: string;
  path: string;
  reason: "unmatched";
};

const LINKABLE_DOCUMENT_TYPES = ["blog", "blogIndex", "page"] as const;

function stripDraftPrefix(id: string): string {
  return id.replace(/^drafts\./, "");
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

function normalizeRelativeHref(href?: string): string | undefined {
  const value = href?.trim();

  if (!value || /^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    return undefined;
  }

  if (value.startsWith("#") || value.startsWith("?")) {
    return undefined;
  }

  return canonicalizeInternalPath(
    value.startsWith("/") ? value : `/${value}`
  );
}

function migrateMarkDef(
  markDef: CustomLinkMarkDef,
  slugLookup: Map<string, string[]>,
  reviewEntries: ReviewEntry[],
  path: string
): CustomLinkMarkDef {
  if (
    markDef._type !== "customLink" ||
    markDef.customLink?._type !== "customUrl" ||
    markDef.customLink.type !== "external"
  ) {
    return markDef;
  }

  const originalHref = markDef.customLink.external ?? markDef.customLink.href;
  const normalizedHref = normalizeRelativeHref(originalHref);

  if (!normalizedHref) {
    return markDef;
  }

  const matches = slugLookup.get(normalizedHref) ?? [];

  if (matches.length === 1) {
    return {
      ...markDef,
      customLink: {
        _type: "customUrl",
        type: "internal",
        href: normalizedHref,
        internal: {
          _ref: matches[0]!,
          _type: "reference",
        },
        openInNewTab: markDef.customLink.openInNewTab ?? false,
      },
    };
  }

  reviewEntries.push({
    href: originalHref ?? normalizedHref,
    normalizedHref,
    path,
    reason: "unmatched",
  });

  if (normalizedHref !== originalHref) {
    return {
      ...markDef,
      customLink: {
        _type: "customUrl",
        type: "external",
        external: normalizedHref,
        href: normalizedHref,
        openInNewTab: markDef.customLink.openInNewTab ?? false,
      },
    };
  }

  return markDef;
}

function migratePortableText(
  blocks: PortableTextBlock[] | undefined,
  slugLookup: Map<string, string[]>,
  reviewEntries: ReviewEntry[],
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
      const nextMarkDef = migrateMarkDef(
        markDef,
        slugLookup,
        reviewEntries,
        markPath
      );

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
  reviewEntries: ReviewEntry[],
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
      reviewEntries,
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

export default defineMigration({
  title: "Convert migrated relative custom links to internal references",
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
        title,
        slug,
        pageBuilder,
        content,
        sections,
        description
      }`
    );

    let convertedLinks = 0;
    const reviewDocuments: Array<{
      document: MigratableDocument;
      entries: ReviewEntry[];
    }> = [];

    for (const document of contentDocuments) {
      const reviewEntries: ReviewEntry[] = [];
      const mutations = [];

      const nextPageBuilder = migrateSectionBlocks(
        document.pageBuilder,
        slugLookup,
        reviewEntries,
        "pageBuilder"
      );
      const nextContentSections = migrateSectionBlocks(
        document.content?.sections,
        slugLookup,
        reviewEntries,
        "content.sections"
      );
      const nextSections = migrateSectionBlocks(
        document.sections,
        slugLookup,
        reviewEntries,
        "sections"
      );
      const nextDescription = migratePortableText(
        document.description,
        slugLookup,
        reviewEntries,
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
        convertedLinks += 1;
        yield patch(document._id, mutations);
      }

      if (reviewEntries.length > 0) {
        reviewDocuments.push({
          document,
          entries: reviewEntries,
        });
      }
    }

    const lines = [
      `[legacy-portable-text-relative-custom-links-to-internal] Documents updated: ${convertedLinks}`,
      `[legacy-portable-text-relative-custom-links-to-internal] Documents still requiring review: ${reviewDocuments.length}`,
    ];

    if (reviewDocuments.length > 0) {
      lines.push("", "[legacy-portable-text-relative-custom-links-to-internal] Remaining review items:");

      for (const { document, entries } of reviewDocuments) {
        lines.push(`- ${getDocumentLabel(document)} [${document._type}] (${entries.length})`);
        for (const entry of entries) {
          lines.push(`  • ${entry.path}`);
          lines.push(`    href: ${entry.href}`);
          lines.push(`    normalized: ${entry.normalizedHref}`);
        }
      }
    }

    console.log(lines.join("\n"));
  },
});
