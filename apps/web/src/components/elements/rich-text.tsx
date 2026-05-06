import { Logger } from "@workspace/logger";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { PortableText, type PortableTextReactComponents } from "next-sanity";
import type { HTMLAttributeReferrerPolicy } from "react";

import type {
  FooterSubtitleRichTextProps,
  LongFormRichTextProps,
  SanityRichTextProps,
} from "@/types";
import { parseChildrenToSlug } from "@/utils";
import { SanityImage } from "./sanity-image";

const logger = new Logger("RichText");

type RichTextFileValue = {
  title?: string | null;
  description?: string | null;
  asset?: {
    url?: string | null;
    originalFilename?: string | null;
  } | null;
};

type YouTubeEmbedValue = {
  title?: string | null;
  url?: string | null;
};

type IframeEmbedValue = {
  title?: string | null;
  code?: string | null;
};

type TableRowValue = {
  _key?: string;
  cells?: Array<string | null> | null;
};

type TableValue = {
  title?: string | null;
  hasHeaderRow?: boolean | null;
  rows?: TableRowValue[] | null;
};

const SAFE_IFRAME_ATTRIBUTES = new Set([
  "allow",
  "allowfullscreen",
  "frameborder",
  "height",
  "loading",
  "referrerpolicy",
  "sandbox",
  "scrolling",
  "src",
  "title",
  "width",
]);

function decodeHtmlEntities(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#34;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function parseHtmlAttributes(value: string): Record<string, string | boolean> {
  const attributes: Record<string, string | boolean> = {};
  const attributePattern =
    /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

  for (const match of value.matchAll(attributePattern)) {
    const rawName = match[1]?.toLowerCase();

    if (!rawName || !SAFE_IFRAME_ATTRIBUTES.has(rawName)) {
      continue;
    }

    const rawValue = match[2] ?? match[3] ?? match[4];
    attributes[rawName] =
      rawValue === undefined ? true : decodeHtmlEntities(rawValue);
  }

  return attributes;
}

function parseIframeEmbed(code?: string | null) {
  if (!code) {
    return null;
  }

  const iframeMatch = code.match(/<iframe\b([^>]*)><\/iframe>/i);

  if (!iframeMatch?.[1]) {
    return null;
  }

  const attributes = parseHtmlAttributes(iframeMatch[1]);
  const src = typeof attributes.src === "string" ? attributes.src.trim() : "";

  if (!src) {
    return null;
  }

  try {
    const parsedUrl = new URL(src);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return null;
    }
  } catch (_error) {
    return null;
  }

  return attributes;
}

function getResponsiveIframeHeight(value?: string | boolean): number {
  if (typeof value !== "string") {
    return 550;
  }

  const height = Number.parseInt(value, 10);
  return Number.isFinite(height) && height > 0 ? height : 550;
}

function getIframeLoading(
  value?: string | boolean
): "eager" | "lazy" | undefined {
  return value === "eager" ? "eager" : "lazy";
}

function getReferrerPolicy(
  value?: string | boolean
): HTMLAttributeReferrerPolicy | undefined {
  switch (value) {
    case "no-referrer":
    case "no-referrer-when-downgrade":
    case "origin":
    case "origin-when-cross-origin":
    case "same-origin":
    case "strict-origin":
    case "strict-origin-when-cross-origin":
    case "unsafe-url":
      return value;
    default:
      return undefined;
  }
}

function getYouTubeEmbedUrl(url?: string | null) {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const videoId = parsedUrl.pathname.split("/").filter(Boolean)[0];
      return videoId
        ? `https://www.youtube-nocookie.com/embed/${videoId}`
        : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const videoId =
        parsedUrl.searchParams.get("v") ||
        parsedUrl.pathname.split("/").filter(Boolean).at(-1);

      return videoId
        ? `https://www.youtube-nocookie.com/embed/${videoId}`
        : null;
    }
  } catch (_error) {
    return null;
  }

  return null;
}

const components: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h2
          className="scroll-m-20 border-b pb-2 font-semibold text-3xl first:mt-0"
          id={slug}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h3 className="scroll-m-20 font-semibold text-2xl" id={slug}>
          {children}
        </h3>
      );
    },
    h4: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h4 className="scroll-m-20 font-semibold text-xl" id={slug}>
          {children}
        </h4>
      );
    },
    h5: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h5 className="scroll-m-20 font-semibold text-lg" id={slug}>
          {children}
        </h5>
      );
    },
    h6: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h6 className="scroll-m-20 font-semibold text-base" id={slug}>
          {children}
        </h6>
      );
    },
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded-md border border-white/10 bg-opacity-5 p-1 text-sm lg:whitespace-nowrap">
        {children}
      </code>
    ),
    customLink: ({ children, value }) => {
      if (!value.href || value.href === "#") {
        return (
          <span className="underline decoration-dotted underline-offset-2">
            Link Broken
          </span>
        );
      }
      return (
        <Link
          aria-label={`Link to ${value?.href}`}
          className="underline decoration-dotted underline-offset-2"
          href={value.href}
          prefetch={false}
          target={value.openInNewTab ? "_blank" : "_self"}
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.id) {
        return null;
      }
      return (
        <figure className="my-4">
          <SanityImage
            className="h-auto w-full rounded-lg"
            height={900}
            image={value}
            width={1600}
          />
          {value?.caption && (
            <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    longRichTextFile: ({ value }) => {
      const file = value as RichTextFileValue;
      const href = file.asset?.url;
      const title =
        file.title || file.asset?.originalFilename || "Download file";

      if (!href) {
        return null;
      }

      return (
        <div className="my-6 rounded-lg border border-border bg-muted/30 p-4">
          <Link
            className="font-medium underline decoration-dotted underline-offset-2"
            href={href}
            rel="noreferrer"
            target="_blank"
          >
            {title}
          </Link>
          {file.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {file.description}
            </p>
          )}
        </div>
      );
    },
    youtubeEmbed: ({ value }) => {
      const embed = value as YouTubeEmbedValue;
      const embedUrl = getYouTubeEmbedUrl(embed.url);

      if (!embedUrl) {
        return null;
      }

      return (
        <figure className="my-6 space-y-3">
          <div className="overflow-hidden rounded-xl border border-border bg-black shadow-sm">
            <div className="aspect-video">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                src={embedUrl}
                title={embed.title || "YouTube video"}
              />
            </div>
          </div>
          {embed.title && (
            <figcaption className="text-center text-sm text-muted-foreground">
              {embed.title}
            </figcaption>
          )}
        </figure>
      );
    },
    iframeEmbed: ({ value }) => {
      const embed = value as IframeEmbedValue;
      const attributes = parseIframeEmbed(embed.code);

      if (!attributes || typeof attributes.src !== "string") {
        return null;
      }

      return (
        <figure className="my-6 space-y-3">
          <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
            <iframe
              allow={
                typeof attributes.allow === "string"
                  ? attributes.allow
                  : undefined
              }
              allowFullScreen={Boolean(attributes.allowfullscreen)}
              className="w-full"
              frameBorder={
                typeof attributes.frameborder === "string"
                  ? attributes.frameborder
                  : undefined
              }
              height={getResponsiveIframeHeight(attributes.height)}
              loading={getIframeLoading(attributes.loading)}
              referrerPolicy={getReferrerPolicy(attributes.referrerpolicy)}
              sandbox={
                typeof attributes.sandbox === "string"
                  ? attributes.sandbox
                  : undefined
              }
              scrolling={
                typeof attributes.scrolling === "string"
                  ? attributes.scrolling
                  : undefined
              }
              src={attributes.src}
              title={
                embed.title ||
                (typeof attributes.title === "string"
                  ? attributes.title
                  : "Embedded content")
              }
              width="100%"
            />
          </div>
          {embed.title && (
            <figcaption className="text-center text-sm text-muted-foreground">
              {embed.title}
            </figcaption>
          )}
        </figure>
      );
    },
    longRichTextTable: ({ value }) => {
      const table = value as TableValue;
      const rows =
        table.rows?.filter(
          (row) =>
            Array.isArray(row.cells) &&
            row.cells.some((cell) => typeof cell === "string" && cell.trim())
        ) ?? [];

      if (rows.length === 0) {
        return null;
      }

      const [headerRow, ...bodyRows] = rows;
      const hasHeaderRow = table.hasHeaderRow !== false;

      return (
        <figure className="my-6 space-y-3">
          {table.title && (
            <figcaption className="text-sm font-medium text-foreground">
              {table.title}
            </figcaption>
          )}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-left text-sm">
              {hasHeaderRow && headerRow && (
                <thead className="bg-muted/50">
                  <tr>
                    {headerRow.cells?.map((cell, index) => (
                      <th
                        className="border-b border-border px-4 py-3 font-semibold"
                        key={`header-${index + 1}`}
                        scope="col"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {(hasHeaderRow ? bodyRows : rows).map((row, rowIndex) => (
                  <tr
                    className="border-b border-border last:border-b-0"
                    key={row._key || `row-${rowIndex + 1}`}
                  >
                    {row.cells?.map((cell, index) => (
                      <td
                        className="px-4 py-3 align-top"
                        key={`${row._key || `row-${rowIndex + 1}`}-${index + 1}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );
    },
  },
  hardBreak: () => <br />,
};

export function RichText({
  richText,
  className,
}: {
  richText?:
    | SanityRichTextProps
    | LongFormRichTextProps
    | FooterSubtitleRichTextProps
    | null;
  className?: string;
}) {
  if (!richText) {
    return null;
  }

  return (
    <div
      className={cn(
        "prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-m-24 prose-h2:border-b prose-h2:pb-2 prose-h2:font-semibold prose-h2:text-3xl prose-headings:text-opacity-90 prose-ol:text-opacity-80 prose-p:text-opacity-80 prose-ul:text-opacity-80 prose-a:decoration-dotted prose-h2:first:mt-0",
        className
      )}
    >
      <PortableText
        components={components}
        onMissingComponent={(_, { nodeType, type }) => {
          logger.warn(`Missing component: ${nodeType} for type: ${type}`);
        }}
        value={richText}
      />
    </div>
  );
}
