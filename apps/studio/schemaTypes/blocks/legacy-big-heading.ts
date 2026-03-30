import { DocumentsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const legacyBigHeading = defineType({
  name: "legacyBigHeading",
  title: "Legacy Migration: Big Heading",
  type: "object",
  icon: DocumentsIcon,
  description:
    "Compatibility block generated from legacy CAC page sections during migration.",
  fields: [defineField({ name: "title", type: "string", title: "Title" })],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title || "Untitled Legacy Heading",
      subtitle: "Legacy migration block",
    }),
  },
});
