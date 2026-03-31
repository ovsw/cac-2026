import { at, defineMigration, set } from "sanity/migrate";

type SanityRecord = Record<string, unknown>;

type LegacyButton = {
  _key?: string;
  _type?: string;
  text?: string;
  url?: string;
};

type MigratedButton = {
  _key?: string;
  _type: "button";
  text?: string;
  variant: "default";
  url: {
    _type: "customUrl";
    type: "external";
    external: string;
    openInNewTab: false;
  };
};

type LegacyBlock = SanityRecord & {
  _key?: string;
  _type?: string;
  button1?: LegacyButton | LegacyButton[];
  buttons?: MigratedButton[];
};

type MigratableDocument = {
  _id: string;
  _type: "page" | "homePage" | "blogIndex" | "reusableSection";
  pageBuilder?: LegacyBlock[];
};

function normalizeLegacyUrl(url?: string): string | undefined {
  const value = url?.trim();

  if (!value) {
    return undefined;
  }

  if (
    value.startsWith("/") ||
    value.startsWith("#") ||
    value.startsWith("?")
  ) {
    return value;
  }

  try {
    return new URL(value).toString();
  } catch (_error) {
    return `/${value}`;
  }
}

function normalizeLegacyButton(button?: LegacyButton): MigratedButton | undefined {
  const text = button?.text?.trim();
  const external = normalizeLegacyUrl(button?.url);

  if (!text && !external) {
    return undefined;
  }

  return {
    _type: "button",
    ...(button?._key ? { _key: button._key } : {}),
    ...(text ? { text } : {}),
    variant: "default",
    url: {
      _type: "customUrl",
      type: "external",
      external: external ?? "#",
      openInNewTab: false,
    },
  };
}

function normalizeLegacyButtons(
  value: LegacyBlock["button1"]
): MigratedButton[] | undefined {
  if (Array.isArray(value)) {
    const buttons = value
      .map((button) => normalizeLegacyButton(button))
      .filter(Boolean) as MigratedButton[];

    return buttons.length ? buttons : undefined;
  }

  const button = normalizeLegacyButton(value);
  return button ? [button] : undefined;
}

function migrateBlock(block: LegacyBlock): LegacyBlock {
  if (
    block._type !== "legacyCtaSection" &&
    block._type !== "legacyMagSection"
  ) {
    return block;
  }

  const { button1, buttons, ...rest } = block;
  const nextButtons =
    Array.isArray(buttons) && buttons.length > 0
      ? buttons
      : normalizeLegacyButtons(button1);

  return {
    ...rest,
    ...(nextButtons ? { buttons: nextButtons } : {}),
  };
}

function migrateBlocks(blocks?: LegacyBlock[]): LegacyBlock[] | undefined {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return undefined;
  }

  let changed = false;

  const nextBlocks = blocks.map((block) => {
    if (
      (block._type === "legacyCtaSection" || block._type === "legacyMagSection") &&
      "button1" in block
    ) {
      changed = true;
      return migrateBlock(block);
    }

    return block;
  });

  return changed ? nextBlocks : undefined;
}

export default defineMigration({
  title: "Backfill legacy pageBuilder button1 fields into buttons arrays",
  documentTypes: ["page", "homePage", "blogIndex", "reusableSection"],
  filter:
    'count(pageBuilder[_type in ["legacyCtaSection", "legacyMagSection"] && defined(button1)]) > 0',
  migrate: {
    document(document) {
      const contentDocument = document as MigratableDocument;
      const nextPageBuilder = migrateBlocks(contentDocument.pageBuilder);

      if (!nextPageBuilder) {
        return;
      }

      return [at("pageBuilder", set(nextPageBuilder))];
    },
  },
});
