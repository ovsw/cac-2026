import { DocumentsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const legacyTestimonialSection = defineType({
  name: "legacyTestimonialSection",
  title: "Legacy Migration: Testimonial Section",
  type: "object",
  icon: DocumentsIcon,
  description:
    "Compatibility block generated from legacy CAC page sections during migration.",
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
      subtitle: "Legacy migration block",
    }),
  },
});
