import { createClient } from "@sanity/client";
import "dotenv/config";

type CustomUrlValue = {
  _type?: "customUrl";
  type?: "external" | "internal";
  external?: string;
  href?: string;
};

type MarkDef = {
  _key?: string;
  _type?: string;
  customLink?: CustomUrlValue;
};

type PortableTextBlock = {
  _key?: string;
  _type?: string;
  markDefs?: MarkDef[];
};

type LegacySectionBlock = {
  _key?: string;
  _type?: string;
  title?: string;
  text?: PortableTextBlock[];
};

type ContentDocument = {
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
  slug?: {
    current?: string;
  };
};

type ReviewItem = {
  href: string;
  normalizedHref: string;
  path: string;
  status: "resolves-to-current-page" | "no-current-match";
};

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "lwnx6aqb";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "development";

function stripDraftPrefix(id: string): string {
  return id.replace(/^drafts\./, "");
}

function canonicalizeInternalPath(path: string): string {
  if (path === "/") {
    return path;
  }

  return path.endsWith("/") ? path.slice(0, -1) : path;
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

function buildSlugLookup(documents: LinkableDocument[]): Set<string> {
  const paths = new Set<string>();

  for (const document of documents) {
    const slug = document.slug?.current?.trim();

    if (!slug) {
      continue;
    }

    paths.add(canonicalizeInternalPath(slug.startsWith("/") ? slug : `/${slug}`));
  }

  return paths;
}

function getDocumentLabel(document: ContentDocument): string {
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

function collectFromPortableText(
  blocks: PortableTextBlock[] | undefined,
  slugLookup: Set<string>,
  pathPrefix: string
): ReviewItem[] {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return [];
  }

  const items: ReviewItem[] = [];

  for (const [blockIndex, block] of blocks.entries()) {
    if (block._type !== "block" || !Array.isArray(block.markDefs)) {
      continue;
    }

    for (const [markIndex, markDef] of block.markDefs.entries()) {
      if (
        markDef._type !== "customLink" ||
        markDef.customLink?._type !== "customUrl" ||
        markDef.customLink.type !== "external"
      ) {
        continue;
      }

      const originalHref = markDef.customLink.external ?? markDef.customLink.href;
      const normalizedHref = normalizeRelativeHref(originalHref);

      if (!normalizedHref) {
        continue;
      }

      items.push({
        href: originalHref ?? normalizedHref,
        normalizedHref,
        path: `${pathPrefix}[${blockIndex}].markDefs[${
          markDef._key ? `_key==\"${markDef._key}\"` : markIndex
        }]`,
        status: slugLookup.has(normalizedHref)
          ? "resolves-to-current-page"
          : "no-current-match",
      });
    }
  }

  return items;
}

function collectFromSectionBlocks(
  blocks: LegacySectionBlock[] | undefined,
  slugLookup: Set<string>,
  pathPrefix: string
): Array<{
  blockType: string;
  blockTitle?: string;
  items: ReviewItem[];
}> {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return [];
  }

  return blocks
    .map((block, blockIndex) => ({
      blockType: block._type ?? "unknown",
      blockTitle: block.title,
      items: collectFromPortableText(
        block.text,
        slugLookup,
        `${pathPrefix}[${blockIndex}].text`
      ),
    }))
    .filter((entry) => entry.items.length > 0);
}

async function main() {
  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-03-31",
    useCdn: false,
    perspective: "raw",
    token: process.env.SANITY_AUTH_TOKEN,
  });

  const [contentDocuments, linkableDocuments] = await Promise.all([
    client.fetch<ContentDocument[]>(
      `*[_type in ["page", "homePage", "blogIndex", "reusableSection"]]{
        _id,
        _type,
        title,
        slug,
        description,
        pageBuilder,
        content,
        sections
      }`
    ),
    client.fetch<LinkableDocument[]>(
      `*[_type in ["page", "blog", "blogIndex"] && defined(slug.current)]{
        _id,
        slug
      }`
    ),
  ]);

  const slugLookup = buildSlugLookup(linkableDocuments);
  const preferredDocuments = new Map<string, ContentDocument>();

  for (const document of contentDocuments) {
    const key = stripDraftPrefix(document._id);
    const existing = preferredDocuments.get(key);

    if (!existing || document._id.startsWith("drafts.")) {
      preferredDocuments.set(key, document);
    }
  }

  const lines = [
    `Legacy portable text link review for ${projectId}/${dataset}`,
    "",
  ];

  let documentCount = 0;
  let itemCount = 0;

  for (const document of preferredDocuments.values()) {
    const descriptionItems = collectFromPortableText(
      document.description,
      slugLookup,
      "description"
    );
    const pageBuilderItems = collectFromSectionBlocks(
      document.pageBuilder,
      slugLookup,
      "pageBuilder"
    );
    const contentSectionItems = collectFromSectionBlocks(
      document.content?.sections,
      slugLookup,
      "content.sections"
    );
    const sectionItems = collectFromSectionBlocks(
      document.sections,
      slugLookup,
      "sections"
    );

    const totalItems =
      descriptionItems.length +
      pageBuilderItems.reduce((sum, entry) => sum + entry.items.length, 0) +
      contentSectionItems.reduce((sum, entry) => sum + entry.items.length, 0) +
      sectionItems.reduce((sum, entry) => sum + entry.items.length, 0);

    if (totalItems === 0) {
      continue;
    }

    documentCount += 1;
    itemCount += totalItems;

    lines.push(`- ${getDocumentLabel(document)} [${document._type}]`);

    for (const item of descriptionItems) {
      lines.push(
        `  • description: ${item.href} -> ${item.status === "resolves-to-current-page" ? "matches a current page" : "no current page match"}`
      );
      lines.push(`    path: ${item.path}`);
      lines.push(`    normalized: ${item.normalizedHref}`);
    }

    for (const group of [...pageBuilderItems, ...contentSectionItems, ...sectionItems]) {
      const label = group.blockTitle
        ? `${group.blockType} "${group.blockTitle}"`
        : group.blockType;

      for (const item of group.items) {
        lines.push(
          `  • ${label}: ${item.href} -> ${item.status === "resolves-to-current-page" ? "matches a current page" : "no current page match"}`
        );
        lines.push(`    path: ${item.path}`);
        lines.push(`    normalized: ${item.normalizedHref}`);
      }
    }
  }

  if (documentCount === 0) {
    lines.push("No remaining legacy portable text review candidates found.");
  } else {
    lines.unshift(
      `Documents with review candidates: ${documentCount}`,
      `Review candidates: ${itemCount}`,
      ""
    );
  }

  // biome-ignore lint/suspicious/noConsole: report script
  console.log(lines.join("\n"));
}

main().catch((error) => {
  // biome-ignore lint/suspicious/noConsole: report script
  console.error(error);
  process.exitCode = 1;
});
