import { DocumentsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const legacyBigHeading = defineType({
  name: "legacyBigHeading",
  title: "Legacy Migration: Big Heading",
  type: "object",
  icon: DocumentsIcon,
  description:
    "Legacy compatibility block for a migrated big heading section from the previous CAC page builder.",
  fields: [defineField({ name: "title", type: "string", title: "Title" })],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title || "Untitled Legacy Heading",
      subtitle: "Legacy Big Heading",
    }),
  },
});
