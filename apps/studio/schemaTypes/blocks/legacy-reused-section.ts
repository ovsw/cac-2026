import { DocumentsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const legacyReusedSection = defineType({
  name: "legacyReusedSection",
  title: "Legacy Migration: Reused Section",
  type: "object",
  icon: DocumentsIcon,
  description:
    "Legacy compatibility block for a migrated reused section reference from the previous CAC page builder.",
  fields: [
    defineField({
      name: "reusableSection",
      title: "Reusable Section",
      type: "reference",
      to: [{ type: "reusableSection" }],
      options: { disableNew: true },
    }),
  ],
  preview: {
    select: {
      title: "reusableSection.title",
    },
    prepare: ({ title }) => ({
      title: title || "Untitled Legacy Reused Section",
      subtitle: "Legacy Reused Section",
    }),
  },
});
