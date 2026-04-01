import { createIfNotExists, defineMigration } from "sanity/migrate";

type SanityRecord = Record<string, unknown>;

type SanityReference = {
  _ref?: string;
  _type?: string;
};

type SanityImage = {
  _type?: string;
  alt?: string;
  caption?: string;
  asset?: SanityReference;
  crop?: SanityRecord;
  hotspot?: SanityRecord;
};

type SanityFile = {
  _key?: string;
  _type?: string;
  asset?: SanityReference;
  title?: string;
  description?: string;
};

type LegacySlug = {
  _type?: "slug";
  current?: string;
};

type LegacyLinkMarkDef = SanityRecord & {
  _key?: string;
  _type?: string;
  href?: string;
  customLink?: SanityRecord;
};

type PortableTextBlock = SanityRecord & {
  _key?: string;
  _type?: string;
  markDefs?: LegacyLinkMarkDef[];
};

type IframeEmbedBlock = {
  _key?: string;
  _type?: "iframeEmbed";
  code?: string;
  title?: string;
  cognitoForm?: boolean | null;
};

type LongRichTextTableRow = {
  _key?: string;
  _type?: string;
  cells?: Array<string | null>;
};

type LongRichTextTable = {
  _key?: string;
  _type?: string;
  title?: string;
  hasHeaderRow?: boolean;
  rows?: LongRichTextTableRow[];
};

type LongRichTextMember =
  | PortableTextBlock
  | IframeEmbedBlock
  | (SanityImage & { _key?: string; _type?: "image" })
  | SanityFile
  | LongRichTextTable
  | (SanityRecord & { _key?: string; _type?: "youtubeEmbed"; url?: string });

type LegacyPageSimpleContent = {
  title?: string | null;
  slug?: LegacySlug | null;
  image?: SanityImage | null;
  body?: LongRichTextMember[] | null;
};

type LegacyPageSimpleDocument = {
  _id: string;
  _type: "pageSimple";
  title?: string | null;
  slug?: LegacySlug | null;
  description?: string | null;
  image?: SanityImage | null;
  content?: LegacyPageSimpleContent | null;
};

function stripDraftPrefix(id: string): string {
  return id.replace(/^drafts\./, "");
}

function getTargetPageId(sourceId: string): string {
  return `page-simple.${stripDraftPrefix(sourceId)}`;
}

function getTargetDraftPageId(sourceId: string): string {
  return `drafts.${getTargetPageId(sourceId)}`;
}

function createArrayKey(value: string): string {
  const normalized = value.replace(/[^a-zA-Z0-9]/g, "");
  return normalized.slice(0, 32) || "item";
}

function normalizeSlug(slug?: LegacySlug | null): LegacySlug | undefined {
  const current = slug?.current?.trim();

  if (!current) {
    return undefined;
  }

  return {
    _type: "slug",
    current: current.startsWith("/") ? current : `/${current}`,
  };
}

function normalizeDescription(value?: string | null): string | undefined {
  const description = value?.trim();
  return description || undefined;
}

function normalizeImage(image?: SanityImage | null): SanityImage | undefined {
  if (!image?.asset?._ref) {
    return undefined;
  }

  return {
    _type: "image",
    ...(image.alt ? { alt: image.alt } : {}),
    ...(image.caption ? { caption: image.caption } : {}),
    asset: image.asset,
    ...(image.crop ? { crop: image.crop } : {}),
    ...(image.hotspot ? { hotspot: image.hotspot } : {}),
  };
}

function normalizeLinkMarkDef(markDef: LegacyLinkMarkDef): LegacyLinkMarkDef {
  if (markDef._type === "customLink") {
    return markDef;
  }

  if (markDef._type !== "link") {
    return markDef;
  }

  const href = markDef.href?.trim() || "#";

  return {
    _key: markDef._key,
    _type: "customLink",
    customLink: {
      _type: "customUrl",
      type: "external",
      external: href,
      href,
      openInNewTab: false,
    },
  };
}

function normalizePortableTextBlock(block: PortableTextBlock): PortableTextBlock {
  if (block._type !== "block") {
    return block;
  }

  return {
    ...block,
    markDefs: block.markDefs?.map(normalizeLinkMarkDef) ?? [],
  };
}

function normalizeFile(file: SanityFile): SanityFile | undefined {
  if (!file.asset?._ref) {
    return undefined;
  }

  return {
    _key: file._key,
    _type: "longRichTextFile",
    asset: file.asset,
    ...(normalizeDescription(file.title) ? { title: file.title?.trim() } : {}),
    ...(normalizeDescription(file.description)
      ? { description: file.description?.trim() }
      : {}),
  };
}

function normalizeIframeEmbed(block: IframeEmbedBlock): IframeEmbedBlock | undefined {
  const code = block.code?.trim();

  if (!code) {
    return undefined;
  }

  return {
    _key: block._key,
    _type: "iframeEmbed",
    code,
    ...(normalizeDescription(block.title) ? { title: block.title?.trim() } : {}),
    ...(typeof block.cognitoForm === "boolean"
      ? { cognitoForm: block.cognitoForm }
      : {}),
  };
}

function normalizeYouTubeEmbed(
  block: SanityRecord & { _key?: string; _type?: string; url?: string }
) {
  const url = block.url?.trim();

  if (!url) {
    return undefined;
  }

  return {
    _key: block._key,
    _type: "youtubeEmbed" as const,
    url,
  };
}

function normalizeTableRow(row: LongRichTextTableRow) {
  const cells =
    row.cells
      ?.map((cell) => (typeof cell === "string" ? cell.trim() : ""))
      .filter(Boolean) ?? [];

  if (cells.length === 0) {
    return undefined;
  }

  return {
    _key: row._key ?? createArrayKey(cells.join("-")),
    _type: "longRichTextTableRow",
    cells,
  };
}

function normalizeTable(table: LongRichTextTable) {
  const rows = table.rows?.map(normalizeTableRow).filter(Boolean);

  if (!rows?.length) {
    return undefined;
  }

  return {
    _key: table._key,
    _type: "longRichTextTable" as const,
    ...(normalizeDescription(table.title) ? { title: table.title?.trim() } : {}),
    hasHeaderRow: table.hasHeaderRow !== false,
    rows,
  };
}

function normalizeLongRichText(
  body?: LongRichTextMember[] | null
): LongRichTextMember[] | undefined {
  if (!Array.isArray(body) || body.length === 0) {
    return undefined;
  }

  const normalizedBody = body
    .map((member) => {
      switch (member._type) {
        case "block":
          return normalizePortableTextBlock(member);
        case "image":
          return normalizeImage(member as SanityImage & { _key?: string; _type?: "image" })
            ? {
                _key: member._key,
                ...normalizeImage(
                  member as SanityImage & { _key?: string; _type?: "image" }
                ),
              }
            : undefined;
        case "file":
        case "longRichTextFile":
          return normalizeFile(member as SanityFile);
        case "iframeEmbed":
          return normalizeIframeEmbed(member as IframeEmbedBlock);
        case "youtubeEmbed":
          return normalizeYouTubeEmbed(
            member as SanityRecord & { _key?: string; _type?: string; url?: string }
          );
        case "table":
        case "longRichTextTable":
          return normalizeTable(member as LongRichTextTable);
        default:
          return undefined;
      }
    })
    .filter(Boolean) as LongRichTextMember[];

  return normalizedBody.length ? normalizedBody : undefined;
}

export default defineMigration({
  title: "Create draft page documents from pageSimple content",
  documentTypes: ["pageSimple"],
  filter: "defined(content.body)",
  async *migrate(_documents, context) {
    const client = context.client.withConfig({ perspective: "raw" });
    const legacyPages = await client.fetch<LegacyPageSimpleDocument[]>(
      `*[_type == "pageSimple"]{
        _id,
        _type,
        title,
        slug,
        description,
        image,
        content
      }`
    );

    for (const legacyPage of legacyPages) {
      const targetDraftId = getTargetDraftPageId(legacyPage._id);
      const targetPublishedId = getTargetPageId(legacyPage._id);

      const existingDraft = await context.filtered.getDocument(targetDraftId);
      const existingPublished = await context.filtered.getDocument(targetPublishedId);

      if (existingDraft || existingPublished) {
        continue;
      }

      const title =
        normalizeDescription(legacyPage.title) ||
        normalizeDescription(legacyPage.content?.title);
      const slug = normalizeSlug(legacyPage.slug || legacyPage.content?.slug);
      const description = normalizeDescription(legacyPage.description);
      const image = normalizeImage(legacyPage.image || legacyPage.content?.image);
      const richText = normalizeLongRichText(legacyPage.content?.body);

      if (!title || !slug || !richText?.length) {
        continue;
      }

      const slugCollision = await client.fetch<{ _id: string } | null>(
        `*[
          _type == "page" &&
          slug.current == $slug &&
          !(_id in [$draftId, $publishedId])
        ][0]{
          _id
        }`,
        {
          slug: slug.current,
          draftId: targetDraftId,
          publishedId: targetPublishedId,
        }
      );

      if (slugCollision?._id) {
        console.log(
          `[page-simple-to-page] Skipping ${legacyPage._id} because ${slug.current} already exists on ${slugCollision._id}`
        );
        continue;
      }

      yield createIfNotExists({
        _id: targetDraftId,
        _type: "page",
        title,
        slug,
        ...(description ? { description } : {}),
        ...(image ? { image } : {}),
        pageBuilder: [
          {
            _key: createArrayKey(targetPublishedId),
            _type: "longRichTextSection",
            title,
            richText,
          },
        ],
      });
    }
  },
});
