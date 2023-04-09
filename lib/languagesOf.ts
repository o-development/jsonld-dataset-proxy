import { ObjectLike } from "./types";

export type LanguageMap = {
  "@none": string;
  [language: string]: string;
};

export type LanguageArrayMap = {
  "@none": Set<string>;
  [language: string]: Set<string>;
};

export function languagesOf<
  Subject extends ObjectLike,
  Key extends keyof Subject
>(
  subject: Subject,
  predicate: Key,
  object?: number
): NonNullable<Subject[Key]> extends Array<unknown>
  ? LanguageArrayMap
  : LanguageMap {
  throw new Error("Not Implemented");
}
