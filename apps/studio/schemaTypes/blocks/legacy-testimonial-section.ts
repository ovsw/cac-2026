import { DocumentsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const legacyTestimonialSection = defineType({
  name: "legacyTestimonialSection",
  title: "Legacy Migration: Testimonial Section",
  type: "object",
  icon: DocumentsIcon,
  description:
    "Legacy compatibility block for a migrated single testimonial section from the previous CAC page builder.",
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "reference",
      to: [{ type: "testimonial" }],
      options: { disableNew: true },
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title || "Untitled Legacy Testimonial Section",
      subtitle: "Legacy Testimonial Section",
    }),
  },
});
