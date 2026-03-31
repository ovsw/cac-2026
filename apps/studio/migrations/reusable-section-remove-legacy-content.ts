import { at, defineMigration, unset } from "sanity/migrate";

type ReusableSectionDocument = {
  description?: unknown;
  pageBuilder?: unknown[];
  sections?: unknown[];
};

export default defineMigration({
  title: "Remove deprecated reusable section legacy content after page-builder migration",
  documentTypes: ["reusableSection"],
  filter:
    "defined(pageBuilder) && (defined(sections) || defined(description))",
  migrate: {
    document(document) {
      const reusableSection = document as ReusableSectionDocument;
      const mutations = [];

      if (reusableSection.sections) {
        mutations.push(at("sections", unset()));
      }

      if (reusableSection.description) {
        mutations.push(at("description", unset()));
      }

      return mutations.length ? mutations : undefined;
    },
  },
});
