import { DocumentsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const reusableSectionReference = defineType({
  name: "reusableSectionReference",
  title: "Reusable Section",
  type: "object",
  icon: DocumentsIcon,
  description:
    "Insert a reusable section so editors can update this content in one place and have the change appear everywhere it is used.",
  fields: [
    defineField({
      name: "reusableSection",
      title: "Reusable Section",
      type: "reference",
      to: [{ type: "reusableSection" }],
      options: { disableNew: true },
      validation: (Rule) =>
        Rule.required().error("Select a reusable section to display here."),
    }),
  ],
  preview: {
    select: {
      title: "reusableSection.title",
    },
    prepare: ({ title }) => ({
      title: title || "Untitled Reusable Section",
      subtitle: "Reusable section reference",
    }),
  },
});
