import {
  CodeBlockIcon,
  DocumentTextIcon,
  ImageIcon,
  LinkIcon,
  PlayIcon,
  UploadIcon,
} from "@sanity/icons";
import { TableProperties } from "lucide-react";
import {
  defineArrayMember,
  defineField,
  defineType,
  type ImageRule,
  type ImageValue,
  type ValidationBuilder,
} from "sanity";

function imageWithCaptionMember(options?: {
  name?: string;
  title?: string;
  validation?: ValidationBuilder<ImageRule, ImageValue>;
}) {
  return defineArrayMember({
    name: options?.name ?? "image",
    title: options?.title ?? "Image",
    type: "image",
    icon: ImageIcon,
    validation: options?.validation,
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: "caption",
        type: "string",
        title: "Caption Text",
        description: "Optional caption shown below the image",
      }),
      defineField({
        name: "alt",
        type: "string",
        title: "Alt Text",
        description: "Describe the image for screen readers and search engines",
      }),
    ],
  });
}

const portableTextBlockMember = defineArrayMember({
  name: "block",
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
    { title: "H4", value: "h4" },
    { title: "H5", value: "h5" },
    { title: "H6", value: "h6" },
    { title: "Inline", value: "inline" },
  ],
  lists: [
    { title: "Numbered", value: "number" },
    { title: "Bullet", value: "bullet" },
  ],
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
      { title: "Code", value: "code" },
    ],
  },
});

export const longRichTextFile = defineType({
  name: "longRichTextFile",
  title: "File",
  type: "file",
  icon: UploadIcon,
  options: {
    storeOriginalFilename: true,
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Optional label shown for the file link",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      rows: 2,
      description: "Optional short description for the file",
    }),
  ],
});

export const youtubeEmbed = defineType({
  name: "youtubeEmbed",
  title: "YouTube Embed",
  type: "object",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Optional label used as the embed title",
    }),
    defineField({
      name: "url",
      type: "url",
      title: "YouTube URL",
      description: "Paste a full YouTube or youtu.be URL",
      validation: (Rule) =>
        Rule.required()
          .uri({
            scheme: ["http", "https"],
          })
          .custom((value) => {
            if (!value) {
              return true;
            }

            try {
              const parsed = new URL(value);
              const isYoutubeHost =
                parsed.hostname === "youtu.be" ||
                parsed.hostname.endsWith("youtube.com") ||
                parsed.hostname.endsWith("youtube-nocookie.com");

              return isYoutubeHost || "Enter a valid YouTube URL";
            } catch (_error) {
              return "Enter a valid YouTube URL";
            }
          }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      url: "url",
    },
    prepare: ({ title, url }) => ({
      title: title || "YouTube Embed",
      subtitle: url || "No URL",
    }),
  },
});

export const iframeEmbed = defineType({
  name: "iframeEmbed",
  title: "Iframe Embed",
  type: "object",
  icon: CodeBlockIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Optional label used to identify this embed",
    }),
    defineField({
      name: "code",
      type: "text",
      title: "Embed Code",
      rows: 6,
      description:
        "Paste the iframe embed code from your provider, such as a form or map",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (typeof value !== "string") {
            return "Embed code is required";
          }

          return (
            value.includes("<iframe") || "Embed code must contain an iframe"
          );
        }),
    }),
    defineField({
      name: "cognitoForm",
      type: "boolean",
      title: "Cognito Form",
      description: "Enable when this embed is a Cognito Form",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      code: "code",
    },
    prepare: ({ title, code }) => ({
      title: title || "Iframe Embed",
      subtitle:
        typeof code === "string" && code.includes("iframe")
          ? "Embedded iframe"
          : "Missing iframe code",
    }),
  },
});

export const longRichTextTableRow = defineType({
  name: "longRichTextTableRow",
  title: "Table Row",
  type: "object",
  fields: [
    defineField({
      name: "cells",
      type: "array",
      title: "Cells",
      description: "Add one value for each cell in this row",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      cells: "cells",
    },
    prepare: ({ cells }) => ({
      title: Array.isArray(cells) ? cells.join(" | ") : "Table Row",
    }),
  },
});

export const longRichTextTable = defineType({
  name: "longRichTextTable",
  title: "Table",
  type: "object",
  icon: TableProperties,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Optional caption shown above the table",
    }),
    defineField({
      name: "hasHeaderRow",
      type: "boolean",
      title: "Use First Row As Header",
      description: "Treat the first row as column headings",
      initialValue: true,
    }),
    defineField({
      name: "rows",
      type: "array",
      title: "Rows",
      description: "Add rows and cells in the order they should appear",
      of: [defineArrayMember({ type: "longRichTextTableRow" })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      rows: "rows",
    },
    prepare: ({ title, rows }) => ({
      title: title || "Table",
      subtitle: `${Array.isArray(rows) ? rows.length : 0} row(s)`,
    }),
  },
});

const longRichTextMembers = [
  portableTextBlockMember,
  imageWithCaptionMember(),
  defineArrayMember({
    type: "longRichTextFile",
    icon: UploadIcon,
  }),
  defineArrayMember({
    type: "youtubeEmbed",
    icon: PlayIcon,
  }),
  defineArrayMember({
    type: "iframeEmbed",
    icon: CodeBlockIcon,
  }),
  defineArrayMember({
    type: "longRichTextTable",
    icon: TableProperties,
  }),
];

export const longRichText = defineType({
  name: "longRichText",
  title: "Long Rich Text",
  type: "array",
  icon: DocumentTextIcon,
  of: longRichTextMembers,
});

export const longRichTextDefinitions = [
  longRichTextFile,
  youtubeEmbed,
  iframeEmbed,
  longRichTextTableRow,
  longRichTextTable,
  longRichText,
];
