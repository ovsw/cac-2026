import { DocumentsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { buttonsField } from "@/schemaTypes/common";

export const legacyMagSection = defineType({
  name: "legacyMagSection",
  title: "Legacy Migration: Magazine Section",
  type: "object",
  icon: DocumentsIcon,
  description:
    "Legacy compatibility block for a migrated magazine section from the previous CAC page builder.",
  fields: [
    defineField({ name: "eyebrow", type: "string", title: "Eyebrow" }),
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "subtitle", type: "string", title: "Subtitle" }),
    defineField({ name: "text", type: "legacyPortableText", title: "Text" }),
    defineField({ name: "image", type: "bgImage", title: "Image" }),
    defineField({ name: "video", type: "url", title: "Video URL" }),
    buttonsField,
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title || "Untitled Legacy Magazine Section",
      subtitle: "Legacy Magazine Section",
    }),
  },
});
