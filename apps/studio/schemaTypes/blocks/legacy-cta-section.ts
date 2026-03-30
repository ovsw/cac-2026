import { DocumentsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const legacyCtaSection = defineType({
  name: "legacyCtaSection",
  title: "Legacy Migration: CTA Section",
  type: "object",
  icon: DocumentsIcon,
  description:
    "Compatibility block generated from legacy CAC page sections during migration.",
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "subtitle", type: "string", title: "Subtitle" }),
    defineField({ name: "text", type: "legacyPortableText", title: "Text" }),
    defineField({
      name: "button1",
      type: "legacyButton",
      title: "Legacy Button",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare: ({ title, subtitle }) => ({
      title: title || "Untitled Legacy CTA Section",
      subtitle: subtitle || "Legacy migration block",
    }),
  },
});
