import { DocumentsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const legacyMagSection = defineType({
  name: "legacyMagSection",
  title: "Legacy Migration: Magazine Section",
  type: "object",
  icon: DocumentsIcon,
  description:
    "Compatibility block generated from legacy CAC page sections during migration.",
  fields: [
    defineField({ name: "eyebrow", type: "string", title: "Eyebrow" }),
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "subtitle", type: "string", title: "Subtitle" }),
    defineField({ name: "text", type: "legacyPortableText", title: "Text" }),
    defineField({ name: "image", type: "bgImage", title: "Image" }),
    defineField({ name: "video", type: "url", title: "Video URL" }),
    defineField({
      name: "button1",
      title: "Legacy Buttons",
      type: "array",
      of: [defineArrayMember({ type: "legacyButton" })],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare: ({ title, subtitle }) => ({
      title: title || "Untitled Legacy Magazine Section",
      subtitle: subtitle || "Legacy migration block",
    }),
  },
});
