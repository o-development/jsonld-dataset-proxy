import { literal, namedNode, quad } from "@rdfjs/data-model";
import { Literal } from "n3";
import { ProxyContext } from "./ProxyContext";
import { getSubjectProxyFromObject } from "./subjectProxy/isSubjectProxy";
import {
  ObjectLike,
  PredicateType,
  SubjectType,
  _getUnderlyingNode,
  _proxyContext,
} from "./types";
import { isLangStringNode, keyToLanguage } from "./util/languageUtils";
import { getProxyFromObject } from "./util/isProxy";

export type LanguageMap = {
  "@none"?: string;
  [language: string]: string | undefined;
};

export type LanguageArrayMap = {
  "@none"?: LanguageArray;
  [language: string]: LanguageArray | undefined;
};

export type LanguageArray = string[];

export type LanguageOfConditionalReturn<
  SubjectObject extends ObjectLike,
  Key extends keyof SubjectObject
> = NonNullable<SubjectObject[Key]> extends Array<unknown>
  ? LanguageArrayMap
  : LanguageMap;

/**
 *
 * @param subject
 * @param predicate
 * @returns
 */
export function languagesOf<
  SubjectObject extends ObjectLike,
  Key extends keyof SubjectObject
>(
  subjectObject: SubjectObject,
  key: Key
): LanguageOfConditionalReturn<SubjectObject, Key> {
  const proxy = getSubjectProxyFromObject(subjectObject);
  const proxyContext = proxy[_proxyContext];
  const subject = proxy[_getUnderlyingNode];
  const predicate = namedNode(proxyContext.contextUtil.keyToIri(key as string));
  if (proxyContext.contextUtil.isArray(key as string)) {
    return createLanguageMapProxy<LanguageMap>(
      subject,
      predicate,
      proxyContext,
      true
    ) as LanguageOfConditionalReturn<SubjectObject, Key>;
  }
  return createLanguageMapProxy<LanguageMap>(
    subject,
    predicate,
    proxyContext,
    false
  ) as LanguageOfConditionalReturn<SubjectObject, Key>;
}

function setLanguageMapTarget(
  target: LanguageMap,
  subject: SubjectType,
  predicate: PredicateType,
  proxyContext: ProxyContext
): void {
  // Clear the target
  Object.keys(target).forEach((key) => delete target[key]);
  // Add current language map to target
  const quads = proxyContext.dataset.match(subject, predicate);
  quads.forEach((quad) => {
    const literal = quad.object;
    if (isLangStringNode(literal)) {
      if (literal.language === "") {
        target["@none"] = literal.value;
      } else {
        target[literal.language] = literal.value;
      }
    }
  });
}

function setLanguageArrayMapTarget(
  target: LanguageArrayMap,
  subject: SubjectType,
  predicate: PredicateType,
  proxyContext: ProxyContext
): void {
  // Clear the target
  Object.keys(target).forEach((key) => delete target[key]);
  // Add current language map to target
  const quads = proxyContext.dataset.match(subject, predicate);
  quads.forEach((quad) => {
    const literal = quad.object;
    if (isLangStringNode(literal)) {
      const languageKey = literal.language === "" ? "@none" : literal.language;
      if (!target[languageKey]) {
        target[languageKey] = [];
      }
      target[languageKey]?.push(literal.value);
    }
  });
}

function createLanguageMapProxy<Target extends LanguageMap | LanguageArrayMap>(
  subject: SubjectType,
  predicate: PredicateType,
  proxyContext: ProxyContext,
  isArray: boolean
): Target {
  const target: Target = {} as Target;
  const targetSetter = isArray
    ? setLanguageArrayMapTarget
    : setLanguageMapTarget;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  targetSetter(target as any, subject, predicate, proxyContext);

  return new Proxy<Target>(target, {
    get: (target, key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      targetSetter(target as any, subject, predicate, proxyContext);
      return Reflect.get(target, key);
    },
    set: (target, key, value) => {
      const language = keyToLanguage(key);
      // Delete all quads with the language currently
      if (!isArray) {
        deleteAllLanguageQuads(subject, predicate, language, proxyContext);
      }
      // Add the new quad for the language
      proxyContext.writeGraphs.forEach((writeGraph) => {
        proxyContext.dataset.add(
          quad(subject, predicate, literal(value, language), writeGraph)
        );
      });
      return Reflect.set(target, key, value);
    },
    deleteProperty: (target, key) => {
      deleteAllLanguageQuads(
        subject,
        predicate,
        keyToLanguage(key),
        proxyContext
      );
      return Reflect.deleteProperty(target, key);
    },
  }) as Target;
}

function createLanguageArrayProxy(): LanguageArray {
  throw new Error("Not Implemented");
}

/**
 * Helpers
 */
export function deleteAllLanguageQuads(
  subject: SubjectType,
  predicate: PredicateType,
  language: string,
  proxyContext: ProxyContext
): void {
  proxyContext.dataset
    .match(subject, predicate)
    .filter(
      (quad) =>
        quad.object.termType === "Literal" && quad.object.language === language
    )
    .forEach((quad) => {
      proxyContext.dataset.delete(quad);
    });
}
