import { LanguageOrdering } from "./types";
import {
  createInteractOptions,
  InteractOptions,
} from "./util/createInteractOptions";

/**
 * Set the default language pr
 * @param graphs The graphs that should be written to
 * @returns a write builder
 */
export function setLanguagePreferences(
  ...languageOrdering: LanguageOrdering
): InteractOptions {
  return createInteractOptions("languageOrdering", languageOrdering);
}
