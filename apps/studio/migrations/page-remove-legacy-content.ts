import { at, defineMigration, unset } from "sanity/migrate";

type PageDocument = {
  content?: unknown;
  pageBuilder?: unknown[];
  slug?: {
    current?: string;
  };
  title?: string;
};

export default defineMigration({
  title: "Remove deprecated page content after page-builder migration",
  documentTypes: ["page"],
  filter:
    "defined(content) && defined(title) && defined(slug.current) && defined(pageBuilder)",
  migrate: {
    document(document) {
      const page = document as PageDocument;

      if (!page.content) {
        return;
      }

      return [at("content", unset())];
    },
  },
});
