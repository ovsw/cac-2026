import { createIfNotExists, defineMigration } from "sanity/migrate";

type SanityRecord = Record<string, unknown>;

type SanityReference = {
  _ref?: string;
  _type?: string;
};

type SanityImage = {
  _type?: string;
  alt?: string;
  asset?: SanityReference;
  crop?: SanityRecord;
  hotspot?: SanityRecord;
};

type LegacySlug = {
  _type?: "slug";
  current?: string;
};

type LegacyLinkMarkDef = SanityRecord & {
  _key?: string;
  _type?: string;
  href?: string;
};

type LegacyBlock = SanityRecord & {
  _key?: string;
  _type?: string;
  markDefs?: LegacyLinkMarkDef[];
};

type LegacySeo = {
  title?: string;
  description?: string;
  image?: SanityImage;
};

type LegacyContent = {
  title?: string;
  excerpt?: string;
  slug?: LegacySlug;
  image?: SanityImage;
  body?: LegacyBlock[];
  publishedAt?: string;
  seo?: LegacySeo;
};

type LegacyPostAuthor =
  | string
  | {
      _ref?: string;
      _type?: string;
    }
  | null
  | undefined;

type LegacyPostDocument = {
  _id: string;
  _type: "post";
  author?: LegacyPostAuthor;
  content?: LegacyContent;
};

type AuthorDocument = {
  _id: string;
  _type: "author";
  name?: string;
};

const DEFAULT_AUTHOR_ID = "3100e2cf-5d72-43cb-9336-72da91cf9928";
const BLOG_ID_PREFIX = "blog.";

function getTargetBlogId(sourceId: string): string {
  return `${BLOG_ID_PREFIX}${sourceId.replace(/^drafts\./, "")}`;
}

function createArrayKey(value: string): string {
  const normalized = value.replace(/[^a-zA-Z0-9]/g, "");
  return normalized.slice(0, 32) || "item";
}

function normalizeSlug(slug?: LegacySlug): LegacySlug | undefined {
  const current = slug?.current?.trim();

  if (!current) {
    return undefined;
  }

  if (current.startsWith("/blog/")) {
    return {
      _type: "slug",
      current,
    };
  }

  const path = current.startsWith("/") ? current : `/${current}`;

  return {
    _type: "slug",
    current: `/blog${path}`,
  };
}

function normalizeDate(value?: string): string | undefined {
  const publishedAt = value?.trim();

  if (!publishedAt) {
    return undefined;
  }

  return publishedAt.slice(0, 10);
}

function normalizeImage(
  image?: SanityImage,
  options?: {
    includeAlt?: boolean;
  }
): SanityImage | undefined {
  if (!image?.asset?._ref) {
    return undefined;
  }

  return {
    _type: "image",
    ...(options?.includeAlt ? { alt: image.alt } : {}),
    asset: image.asset,
    ...(image.crop ? { crop: image.crop } : {}),
    ...(image.hotspot ? { hotspot: image.hotspot } : {}),
  };
}

function normalizeLinkMarkDef(markDef: LegacyLinkMarkDef): LegacyLinkMarkDef {
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

function normalizePortableTextBlock(block: LegacyBlock): LegacyBlock {
  if (block._type !== "block") {
    return block;
  }

  return {
    ...block,
    markDefs: block.markDefs?.map(normalizeLinkMarkDef) ?? [],
  };
}

function normalizePortableText(body?: LegacyBlock[]): LegacyBlock[] | undefined {
  if (!body?.length) {
    return undefined;
  }

  return body.map(normalizePortableTextBlock);
}

function resolveLegacyAuthorId(
  legacyAuthor: LegacyPostAuthor,
  authorsById: Map<string, AuthorDocument>,
  authorsByName: Map<string, AuthorDocument>
): string {
  if (legacyAuthor && typeof legacyAuthor === "object" && legacyAuthor._ref) {
    if (authorsById.has(legacyAuthor._ref)) {
      return legacyAuthor._ref;
    }
  }

  if (typeof legacyAuthor === "string") {
    const trimmed = legacyAuthor.trim();

    if (authorsById.has(trimmed)) {
      return trimmed;
    }

    const normalizedName = trimmed.toLocaleLowerCase();
    const author = authorsByName.get(normalizedName);

    if (author?._id) {
      return author._id;
    }
  }

  return DEFAULT_AUTHOR_ID;
}

export default defineMigration({
  title: "Create blog documents from legacy post content",
  documentTypes: ["post"],
  filter: "defined(content)",
  async *migrate(documents, context) {
    const authorDocuments = await context.client.fetch<AuthorDocument[]>(
      `*[_type == "author"]{_id, _type, name}`
    );

    const authorsById = new Map(
      authorDocuments.map((author) => [author._id, author] as const)
    );
    const authorsByName = new Map(
      authorDocuments
        .filter((author) => typeof author.name === "string" && author.name.trim())
        .map((author) => [author.name!.trim().toLocaleLowerCase(), author] as const)
    );

    for await (const document of documents()) {
      const legacyPost = document as LegacyPostDocument;
      const targetBlogId = getTargetBlogId(legacyPost._id);
      const existingBlog = await context.filtered.getDocument(targetBlogId);

      if (existingBlog) {
        continue;
      }

      const normalizedSlug = normalizeSlug(legacyPost.content?.slug);
      const normalizedImage = normalizeImage(legacyPost.content?.image, {
        includeAlt: true,
      });
      const normalizedSeoImage = normalizeImage(legacyPost.content?.seo?.image);
      const normalizedRichText = normalizePortableText(legacyPost.content?.body);
      const authorId = resolveLegacyAuthorId(
        legacyPost.author,
        authorsById,
        authorsByName
      );

      yield createIfNotExists({
        _id: targetBlogId,
        _type: "blog",
        ...(legacyPost.content?.title
          ? { title: legacyPost.content.title }
          : {}),
        ...(legacyPost.content?.excerpt
          ? { description: legacyPost.content.excerpt }
          : {}),
        ...(normalizedSlug ? { slug: normalizedSlug } : {}),
        authors: [
          {
            _key: createArrayKey(authorId),
            _ref: authorId,
            _type: "reference",
          },
        ],
        ...(normalizeDate(legacyPost.content?.publishedAt)
          ? { publishedAt: normalizeDate(legacyPost.content?.publishedAt) }
          : {}),
        ...(normalizedImage ? { image: normalizedImage } : {}),
        ...(normalizedRichText ? { richText: normalizedRichText } : {}),
        ...(legacyPost.content?.seo?.title
          ? {
              seoTitle: legacyPost.content.seo.title,
              ogTitle: legacyPost.content.seo.title,
            }
          : {}),
        ...(legacyPost.content?.seo?.description
          ? {
              seoDescription: legacyPost.content.seo.description,
              ogDescription: legacyPost.content.seo.description,
            }
          : {}),
        ...(normalizedSeoImage ? { seoImage: normalizedSeoImage } : {}),
      });
    }
  },
});
