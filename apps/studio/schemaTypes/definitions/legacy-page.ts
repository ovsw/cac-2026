import {
  type ConditionalProperty,
  defineArrayMember,
  defineField,
  defineType,
} from "sanity";

import { GROUP } from "@/utils/constant";

const deprecatedReason =
  "Legacy CAC page data kept for migration verification and rollback. Edit the new page builder fields instead.";

const legacyLinkMark = defineArrayMember({
  name: "block",
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
    { title: "H4", value: "h4" },
    { title: "H5", value: "h5" },
    { title: "H6", value: "h6" },
    { title: "Inline", value: "inline" },
  ],
  lists: [
    { title: "Numbered", value: "number" },
    { title: "Bullet", value: "bullet" },
  ],
  marks: {
    annotations: [
      {
        name: "link",
        title: "Legacy Link",
        type: "object",
        fields: [
          defineField({
            name: "href",
            type: "url",
            title: "URL",
          }),
        ],
      },
    ],
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
      { title: "Code", value: "code" },
    ],
  },
});

export const legacyPortableText = defineType({
  name: "legacyPortableText",
  title: "Legacy Portable Text",
  type: "array",
  of: [legacyLinkMark],
});

const hiddenIfUndefined = ({ value }: { value: unknown }) =>
  value === undefined;

const deprecatedFieldOptions = {
  deprecated: {
    reason: deprecatedReason,
  },
  readOnly: true,
  hidden: hiddenIfUndefined as ConditionalProperty,
  initialValue: undefined,
};

export const legacyButton = defineType({
  name: "legacyButton",
  title: "Legacy Button",
  type: "object",
  fields: [
    defineField({
      name: "text",
      type: "string",
      title: "Button Text",
    }),
    defineField({
      name: "url",
      type: "url",
      title: "Button URL",
    }),
  ],
});

const createLegacyImage = (name: "mainImage" | "bgImage", title: string) =>
  defineType({
    name,
    title,
    type: "image",
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: "alt",
        type: "string",
        title: "Alt Text",
      }),
    ],
  });

export const legacyMainImage = createLegacyImage(
  "mainImage",
  "Legacy Main Image"
);
export const legacyBgImage = createLegacyImage(
  "bgImage",
  "Legacy Background Image"
);

export const legacySeo = defineType({
  name: "seo",
  title: "Legacy SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      title: "Description",
    }),
    defineField({
      name: "image",
      type: "mainImage",
      title: "Image",
    }),
    defineField({
      name: "noIndex",
      type: "boolean",
      title: "No Index",
    }),
  ],
});

export const legacyMagSectionSource = defineType({
  name: "magSection",
  title: "Legacy Source: Magazine Section",
  type: "object",
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
});

export const legacyCtaSectionSource = defineType({
  name: "ctaSection",
  title: "Legacy Source: CTA Section",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "subtitle", type: "string", title: "Subtitle" }),
    defineField({ name: "text", type: "legacyPortableText", title: "Text" }),
    defineField({
      name: "button1",
      title: "Legacy Button",
      type: "legacyButton",
    }),
  ],
});

export const legacyBigHeadingSource = defineType({
  name: "bigHeading",
  title: "Legacy Source: Big Heading",
  type: "object",
  fields: [defineField({ name: "title", type: "string", title: "Title" })],
});

export const legacyFaqSectionSource = defineType({
  name: "faqSection",
  title: "Legacy Source: FAQ Section",
  type: "object",
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
});

export const legacyTestimonialSectionSource = defineType({
  name: "testimonialSection",
  title: "Legacy Source: Testimonial Section",
  type: "object",
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
});

export const legacyTestimonialsSectionSource = defineType({
  name: "testimonialsSection",
  title: "Legacy Source: Testimonials Section",
  type: "object",
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
});

export const legacyReusedSectionSource = defineType({
  name: "reusedSection",
  title: "Legacy Source: Reused Section",
  type: "object",
  fields: [
    defineField({
      name: "reusableSection",
      title: "Reusable Section",
      type: "reference",
      to: [{ type: "reusableSection" }],
      options: { disableNew: true },
    }),
  ],
});

export const legacyPageContent = defineType({
  name: "legacyPageContent",
  title: "Legacy Page Content",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Legacy Title",
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Legacy URL",
    }),
    defineField({
      name: "headerImage",
      type: "mainImage",
      title: "Legacy Header Image",
    }),
    defineField({
      name: "seo",
      type: "seo",
      title: "Legacy SEO",
    }),
    defineField({
      name: "sections",
      title: "Legacy Sections",
      type: "array",
      of: [
        defineArrayMember({ type: "magSection" }),
        defineArrayMember({ type: "ctaSection" }),
        defineArrayMember({ type: "bigHeading" }),
        defineArrayMember({ type: "faqSection" }),
        defineArrayMember({ type: "testimonialSection" }),
        defineArrayMember({ type: "testimonialsSection" }),
        defineArrayMember({ type: "reusedSection" }),
      ],
    }),
  ],
});

export const legacyPageMigrationFields = [
  defineField({
    name: "section",
    type: "string",
    title: "Legacy Section",
    description:
      "Deprecated CAC navigation section preserved temporarily during the page-builder rollout.",
    group: GROUP.MAIN_CONTENT,
    ...deprecatedFieldOptions,
  }),
  defineField({
    name: "content",
    type: "legacyPageContent",
    title: "Legacy Page Content",
    description:
      "Deprecated CAC content payload preserved temporarily for migration verification and rollback.",
    group: GROUP.MAIN_CONTENT,
    ...deprecatedFieldOptions,
  }),
];

export const legacyPageDefinitions = [
  legacyPortableText,
  legacyButton,
  legacyMainImage,
  legacyBgImage,
  legacySeo,
  legacyMagSectionSource,
  legacyCtaSectionSource,
  legacyBigHeadingSource,
  legacyFaqSectionSource,
  legacyTestimonialSectionSource,
  legacyTestimonialsSectionSource,
  legacyReusedSectionSource,
  legacyPageContent,
];
