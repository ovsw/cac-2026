import { at, defineMigration, set } from "sanity/migrate";

type PageDocument = {
  slug?: {
    current?: string;
  };
};

function normalizePath(path?: string): string | undefined {
  const trimmedPath = path?.trim();

  if (!trimmedPath) {
    return undefined;
  }

  return trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
}

export default defineMigration({
  title: "Add a leading slash to page slugs",
  documentTypes: ["page"],
  filter: "defined(slug.current) && !string::startsWith(slug.current, '/')",
  migrate: {
    document(document) {
      const page = document as PageDocument;
      const normalizedPath = normalizePath(page.slug?.current);

      if (!normalizedPath || normalizedPath === page.slug?.current) {
        return;
      }

      return [at("slug.current", set(normalizedPath))];
    },
  },
});
