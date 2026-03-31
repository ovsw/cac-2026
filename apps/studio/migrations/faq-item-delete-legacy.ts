import { defineMigration, del } from "sanity/migrate";

const FAQ_ID_PREFIX = "faq.";

function getTargetFaqId(sourceId: string): string {
  return `${FAQ_ID_PREFIX}${sourceId.replace(/^drafts\./, "")}`;
}

export default defineMigration({
  title: "Delete legacy faqItem documents after faq cutover",
  documentTypes: ["faqItem"],
  migrate: {
    async document(document, context) {
      const client = context.client.withConfig({ perspective: "raw" });
      const targetFaqId = getTargetFaqId(document._id);
      const result = await client.fetch<{
        refCount: number;
        targetExists: boolean;
      }>(
        `{
          "refCount": count(*[references($legacyId)]),
          "targetExists": defined(*[_id == $targetFaqId][0]._id)
        }`,
        {
          legacyId: document._id,
          targetFaqId,
        }
      );

      if (!result?.targetExists || result.refCount > 0) {
        return [];
      }

      return del(document._id);
    },
  },
});
