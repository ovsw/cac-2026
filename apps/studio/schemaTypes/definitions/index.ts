import { button } from "@/schemaTypes/definitions/button";
import { customUrl } from "@/schemaTypes/definitions/custom-url";
import { legacyPageDefinitions } from "@/schemaTypes/definitions/legacy-page";
import { longRichTextDefinitions } from "@/schemaTypes/definitions/long-rich-text";
import {
  pageBuilder,
  reusableSectionPageBuilder,
} from "@/schemaTypes/definitions/pagebuilder";
import { richText } from "@/schemaTypes/definitions/rich-text";

export const definitions = [
  customUrl,
  richText,
  ...longRichTextDefinitions,
  button,
  pageBuilder,
  reusableSectionPageBuilder,
  ...legacyPageDefinitions,
];
