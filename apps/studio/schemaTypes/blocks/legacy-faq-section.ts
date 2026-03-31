import { DocumentsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const legacyFaqSection = defineType({
  name: "legacyFaqSection",
  title: "Legacy Migration: FAQ Section",
  type: "object",
  icon: DocumentsIcon,
  description:
    "Legacy compatibility block for a migrated FAQ section from the previous CAC page builder.",
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "faq" }],
          options: { disableNew: true },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      count: "faqItems",
    },
    prepare: ({ title, count = [] }) => ({
      title: title || "Untitled Legacy FAQ Section",
      subtitle: `${count.length} FAQs`,
    }),
  },
});
