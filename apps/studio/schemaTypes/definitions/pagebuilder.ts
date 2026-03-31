import { defineArrayMember, defineType } from "sanity";

import { pageBuilderBlocks } from "@/schemaTypes/blocks/index";

type PageBuilderDefinitionOptions = {
  includeReusableSectionReference?: boolean;
};

function getPageBuilderBlockTypes({
  includeReusableSectionReference = true,
}: PageBuilderDefinitionOptions = {}) {
  return pageBuilderBlocks
    .filter(
      ({ name }) =>
        includeReusableSectionReference || name !== "reusableSectionReference"
    )
    .map(({ name }) => ({ type: name }));
}

function createPageBuilderType(
  name: string,
  options?: PageBuilderDefinitionOptions
) {
  const blockTypes = getPageBuilderBlockTypes(options);

  return defineType({
    name,
    type: "array",
    of: blockTypes.map((block) => defineArrayMember(block)),
    options: {
      insertMenu: {
        views: [
          {
            name: "grid",
            previewImageUrl: (schemaTypeName) => {
              const kebabCaseName = schemaTypeName
                .replace(/([a-z])([A-Z])/g, "$1-$2")
                .toLowerCase();
              const filePath = `/static/thumbnails/preview-${kebabCaseName}.png`;
              return filePath;
            },
          },
        ],
      },
    },
  });
}

export const pageBuilder = createPageBuilderType("pageBuilder");

export const reusableSectionPageBuilder = createPageBuilderType(
  "reusableSectionPageBuilder",
  {
    includeReusableSectionReference: false,
  }
);
