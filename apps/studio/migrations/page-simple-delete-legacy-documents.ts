import { defineMigration, del } from "sanity/migrate";

type LegacyPageSimpleDocument = {
  _id: string;
  _type: "pageSimple";
};

export default defineMigration({
  title: "Delete legacy pageSimple documents after page migration",
  documentTypes: ["pageSimple"],
  async *migrate(documents) {
    for await (const document of documents()) {
      const legacyPageSimple = document as LegacyPageSimpleDocument;
      yield del(legacyPageSimple._id);
    }
  },
});
