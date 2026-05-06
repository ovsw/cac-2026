import { DocumentsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const legacyTestimonialsSection = defineType({
  name: "legacyTestimonialsSection",
  title: "Legacy Migration: Testimonials Section",
  type: "object",
  icon: DocumentsIcon,
  description:
    "Legacy compatibility block for a migrated testimonials section from the previous CAC page builder.",
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({
      name: "testimonialsList",
      title: "Testimonials",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "testimonial" }],
          options: { disableNew: true },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      count: "testimonialsList",
    },
    prepare: ({ title, count = [] }) => ({
      title: title || "Untitled Legacy Testimonials Section",
      subtitle: `${count.length} testimonials`,
    }),
  },
});
