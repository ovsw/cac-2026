import { defineMigration, del } from "sanity/migrate";

type LegacyPostDocument = {
  _id: string;
  _type: "post";
};

export default defineMigration({
  title: "Delete legacy post documents after blog migration",
  documentTypes: ["post"],
  async *migrate(documents) {
    for await (const document of documents()) {
      const legacyPost = document as LegacyPostDocument;
      yield del(legacyPost._id);
    }
  },
});
