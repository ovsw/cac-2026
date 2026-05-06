import { DocumentsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import {
  legacyBigHeadingSource,
  legacyCtaSectionSource,
  legacyFaqSectionSource,
  legacyMagSectionSource,
  legacyPortableText,
  legacyReusedSectionSource,
  legacyTestimonialSectionSource,
  legacyTestimonialsSectionSource,
} from "@/schemaTypes/definitions/legacy-page";

export const legacyReusableSection = defineType({
  name: "reusableSection",
  title: "Reusable Section",
  type: "document",
  icon: DocumentsIcon,
  description:
    "Create shared sections that can be inserted across multiple pages and updated from one place.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description:
        "The internal name editors will use to find this reusable section.",
      validation: (Rule) =>
        Rule.required().error("A reusable section title is required."),
    }),
    defineField({
      name: "pageBuilder",
      title: "Reusable Section Content",
      type: "reusableSectionPageBuilder",
      description:
        "Build the shared section content that should appear anywhere this reusable section is referenced.",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      readOnly: true,
      of: [
        defineArrayMember({ type: legacyMagSectionSource.name }),
        defineArrayMember({ type: legacyCtaSectionSource.name }),
        defineArrayMember({ type: legacyBigHeadingSource.name }),
        defineArrayMember({ type: legacyFaqSectionSource.name }),
        defineArrayMember({ type: legacyTestimonialSectionSource.name }),
        defineArrayMember({ type: legacyTestimonialsSectionSource.name }),
        defineArrayMember({ type: legacyReusedSectionSource.name }),
      ],
      deprecated: {
        reason:
          "Legacy migration source field preserved for compatibility while reusable sections move to the new page builder.",
      },
      hidden: ({ value }) => value === undefined,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: legacyPortableText.name,
      hidden: ({ value }) => value === undefined,
      readOnly: true,
      deprecated: {
        reason:
          "Legacy migration field preserved temporarily for verification and cleanup.",
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      blockCount: "pageBuilder",
    },
    prepare: ({ blockCount, title }) => ({
      title: title || "Untitled Reusable Section",
      subtitle: Array.isArray(blockCount)
        ? `Reusable blocks: ${blockCount.length}`
        : "Reusable section",
    }),
  },
});

export const legacyReferenceDocuments = [legacyReusableSection];
