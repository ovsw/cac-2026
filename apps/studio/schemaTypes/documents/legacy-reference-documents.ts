import { DocumentsIcon, UsersIcon } from "@sanity/icons";
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

const deprecatedDocumentOptions = {
  deprecated: {
    reason:
      "Legacy CAC content preserved for page migration compatibility. Do not create new documents of this type.",
  },
};

export const legacyTestimonial = defineType({
  name: "testimonial",
  title: "Legacy Testimonial",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "author",
      type: "string",
      title: "Author",
      readOnly: true,
    }),
    defineField({
      name: "text",
      type: "text",
      title: "Text",
      rows: 5,
      readOnly: true,
    }),
  ],
  ...deprecatedDocumentOptions,
});

export const legacyReusableSection = defineType({
  name: "reusableSection",
  title: "Legacy Reusable Section",
  type: "document",
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      readOnly: true,
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
    }),
    defineField({
      name: "description",
      title: "Description",
      type: legacyPortableText.name,
      hidden: true,
      readOnly: true,
    }),
  ],
  ...deprecatedDocumentOptions,
});

export const legacyReferenceDocuments = [
  legacyTestimonial,
  legacyReusableSection,
];
