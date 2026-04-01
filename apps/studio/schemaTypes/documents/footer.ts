import { LinkIcon } from "@sanity/icons";
import { LayoutPanelLeft, Link, PanelBottom } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

const footerColumnLink = defineField({
  name: "footerColumnLink",
  type: "object",
  icon: Link,
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      description: "Name for the link",
    }),
    defineField({
      name: "url",
      type: "customUrl",
    }),
  ],
  preview: {
    select: {
      title: "name",
      externalUrl: "url.external",
      urlType: "url.type",
      internalUrl: "url.internal.slug.current",
      openInNewTab: "url.openInNewTab",
    },
    prepare({ title, externalUrl, urlType, internalUrl, openInNewTab }) {
      const url = urlType === "external" ? externalUrl : internalUrl;
      const newTabIndicator = openInNewTab ? " ↗" : "";
      const truncatedUrl =
        url?.length > 30 ? `${url.substring(0, 30)}...` : url;

      return {
        title: title || "Untitled Link",
        subtitle: `${urlType === "external" ? "External" : "Internal"} • ${truncatedUrl}${newTabIndicator}`,
        media: Link,
      };
    },
  },
});

const footerColumn = defineField({
  name: "footerColumn",
  type: "object",
  icon: LayoutPanelLeft,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Title for the column",
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Links",
      description: "Links for the column",
      of: [footerColumnLink],
    }),
  ],
  preview: {
    select: {
      title: "title",
      links: "links",
    },
    prepare({ title, links = [] }) {
      return {
        title: title || "Untitled Column",
        subtitle: `${links.length} link${links.length === 1 ? "" : "s"}`,
      };
    },
  },
});

const footerSubtitle = defineField({
  name: "subtitlePortableText",
  type: "array",
  title: "Subtitle",
  description:
    "Rich subtitle shown beneath the logo in the footer. You can add links for contact details, maps, and other footer references.",
  of: [
    defineArrayMember({
      name: "block",
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Inline", value: "inline" },
      ],
      lists: [],
      marks: {
        annotations: [
          {
            name: "customLink",
            type: "object",
            title: "Internal/External Link",
            icon: LinkIcon,
            fields: [
              defineField({
                name: "customLink",
                type: "customUrl",
              }),
            ],
          },
        ],
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
      },
    }),
  ],
});

const footerLegalLink = defineField({
  name: "footerLegalLink",
  type: "object",
  icon: Link,
  fields: [
    defineField({
      name: "label",
      type: "string",
      title: "Label",
      description: "Text shown for this legal link in the footer.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      type: "customUrl",
      title: "URL",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      externalUrl: "url.external",
      urlType: "url.type",
      internalUrl: "url.internal.slug.current",
      openInNewTab: "url.openInNewTab",
    },
    prepare({ title, externalUrl, urlType, internalUrl, openInNewTab }) {
      const url = urlType === "external" ? externalUrl : internalUrl;
      const newTabIndicator = openInNewTab ? " ↗" : "";
      const truncatedUrl =
        url?.length > 30 ? `${url.substring(0, 30)}...` : url;

      return {
        title: title || "Untitled Legal Link",
        subtitle: `${urlType === "external" ? "External" : "Internal"} • ${truncatedUrl}${newTabIndicator}`,
        media: Link,
      };
    },
  },
});

export const footer = defineType({
  name: "footer",
  type: "document",
  title: "Footer",
  description: "Footer content for your website",
  fields: [
    defineField({
      name: "label",
      type: "string",
      initialValue: "Footer",
      title: "Label",
      description: "Label used to identify footer in the CMS",
      validation: (rule) => rule.required(),
    }),
    footerSubtitle,
    defineField({
      name: "columns",
      type: "array",
      title: "Columns",
      description: "Columns for the footer",
      of: [footerColumn],
    }),
    defineField({
      name: "legalLinks",
      type: "array",
      title: "Legal Links",
      description:
        "Links shown in the bottom-right legal area of the footer. Reorder them to control their display order.",
      of: [footerLegalLink],
    }),
  ],
  preview: {
    select: {
      title: "label",
    },
    prepare: ({ title }) => ({
      title: title || "Untitled Footer",
      media: PanelBottom,
    }),
  },
});
