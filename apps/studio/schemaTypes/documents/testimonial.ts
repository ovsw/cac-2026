import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const truncate = (value?: string, maxLength = 80) => {
  if (!value) {
    return "No testimonial text yet";
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
};

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      description:
        "Enter the name and context for the person giving this testimonial.",
      validation: (Rule) =>
        Rule.required().error("The testimonial author is required."),
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 5,
      description:
        "Paste the full testimonial text exactly as it should appear.",
      validation: (Rule) =>
        Rule.required().error("The testimonial text is required."),
    }),
  ],
  preview: {
    select: {
      title: "author",
      text: "text",
    },
    prepare: ({ title, text }) => ({
      title: title || "Unnamed Testimonial",
      subtitle: truncate(text),
    }),
  },
});
