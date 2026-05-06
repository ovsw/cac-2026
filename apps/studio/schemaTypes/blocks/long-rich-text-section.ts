import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const longRichTextSection = defineType({
  name: "longRichTextSection",
  type: "object",
  title: "Long Rich Text",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Optional heading displayed above the long-form content",
    }),
    defineField({
      name: "richText",
      type: "longRichText",
      title: "Content",
      description:
        "Add long-form text, files, videos, embeds, and tables in one content stream",
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      richText: "richText",
    },
    prepare: ({ title, richText }) => ({
      title: title || "Long Rich Text",
      subtitle: `${Array.isArray(richText) ? richText.length : 0} item(s)`,
    }),
  },
});
