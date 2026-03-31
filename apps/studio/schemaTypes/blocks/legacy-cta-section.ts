import { DocumentsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { buttonsField } from "@/schemaTypes/common";

export const legacyCtaSection = defineType({
  name: "legacyCtaSection",
  title: "Legacy Migration: CTA Section",
  type: "object",
  icon: DocumentsIcon,
  description:
    "Legacy compatibility block for a migrated call-to-action section from the previous CAC page builder.",
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "subtitle", type: "string", title: "Subtitle" }),
    defineField({ name: "text", type: "legacyPortableText", title: "Text" }),
    buttonsField,
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare: ({ title, subtitle }) => ({
      title: title || "Untitled Legacy CTA Section",
      subtitle: subtitle || "Legacy CTA Section",
    }),
  },
});
