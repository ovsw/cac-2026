import "dotenv/config";

import { createClient } from "@sanity/client";

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

type LegacyBlogHomeDocument = {
  _id: "blogHome";
  _type: "pageSpecial";
  content?: {
    title?: string;
    headerImage?: SanityImage;
    seo?: {
      title?: string;
      description?: string;
      image?: SanityImage;
    };
  };
};

type BlogIndexDocument = SanityRecord & {
  _id: string;
  _type: "blogIndex";
};

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "lwnx6aqb";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "development";

function normalizeText(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function normalizeImage(image?: SanityImage): SanityImage | undefined {
  if (!image?.asset?._ref) {
    return undefined;
  }

  return {
    _type: "image",
    ...(image.alt ? { alt: image.alt } : {}),
    asset: image.asset,
    ...(image.crop ? { crop: image.crop } : {}),
    ...(image.hotspot ? { hotspot: image.hotspot } : {}),
  };
}

function stripSystemFields<T extends SanityRecord>(document: T): T {
  const { _createdAt, _updatedAt, _rev, ...rest } = document;
  return rest as T;
}

async function main() {
  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-04-01",
    useCdn: false,
    perspective: "raw",
    token: process.env.SANITY_AUTH_TOKEN,
  });

  if (!process.env.SANITY_AUTH_TOKEN) {
    throw new Error(
      "SANITY_AUTH_TOKEN is required. Run this script with `sanity exec ... --with-user-token`."
    );
  }

  const [legacyBlogHome, existingDraft, existingPublished] = await Promise.all([
    client.fetch<LegacyBlogHomeDocument | null>(
      `*[_id == "blogHome" && _type == "pageSpecial"][0]{
        _id,
        _type,
        content{
          title,
          headerImage,
          seo
        }
      }`
    ),
    client.fetch<BlogIndexDocument | null>(`*[_id == "drafts.blogIndex"][0]{...}`),
    client.fetch<BlogIndexDocument | null>(`*[_id == "blogIndex"][0]{...}`),
  ]);

  if (!legacyBlogHome?.content) {
    console.log("No legacy blogHome document with content was found.");
    return;
  }

  const title = normalizeText(legacyBlogHome.content.title);
  const headerImage = normalizeImage(legacyBlogHome.content.headerImage);
  const seoTitle = normalizeText(legacyBlogHome.content.seo?.title);
  const seoDescription = normalizeText(legacyBlogHome.content.seo?.description);
  const seoImage = normalizeImage(legacyBlogHome.content.seo?.image);

  const seedFields = {
    slug: {
      _type: "slug" as const,
      current: "/blog",
    },
    displayFeaturedBlogs: "yes" as const,
    featuredBlogsCount: "1" as const,
    ...(title ? { title } : {}),
    ...(headerImage ? { headerImage } : {}),
    ...(seoTitle ? { seoTitle } : {}),
    ...(seoDescription ? { seoDescription } : {}),
    ...(seoImage ? { seoImage } : {}),
  };

  const transaction = client.transaction();

  if (!existingDraft) {
    const baseDraft = existingPublished
      ? {
          ...stripSystemFields(existingPublished),
          _id: "drafts.blogIndex",
        }
      : {
          _id: "drafts.blogIndex",
          _type: "blogIndex" as const,
        };

    transaction.createIfNotExists(baseDraft);
  }

  transaction.patch("drafts.blogIndex", (patch) => patch.setIfMissing(seedFields));

  const result = await transaction.commit({
    autoGenerateArrayKeys: true,
  });

  console.log(
    `Seeded drafts.blogIndex from blogHome in ${projectId}/${dataset}. Transaction: ${result.transactionId}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
