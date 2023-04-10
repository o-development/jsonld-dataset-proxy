import { Dataset, Quad, Literal, Quad_Object } from "@rdfjs/types";
import { createDataset } from "o-dataset-pack";
import { ProxyContext } from "../ProxyContext";
import { PredicateType, SubjectType } from "../types";

function addToDatasetMap(
  key: string,
  value: Quad,
  map: Record<string, Dataset>
) {
  if (!map[key]) {
    map[key] = createDataset();
  }
  map[key].add(value);
}

export function isLangStringNode(node: Quad_Object): node is Literal {
  return (
    node.termType === "Literal" &&
    (node.datatype.value ===
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString" ||
      node.datatype.value === "http://www.w3.org/2001/XMLSchema#string")
  );
}

export function languageMatch(
  dataset: Dataset,
  subject: SubjectType,
  predicate: PredicateType,
  language: string
): Dataset {
  const languageValue = keyToLanguage(language);
  return dataset.match(subject, predicate).filter((quad) => {
    return (
      isLangStringNode(quad.object) && quad.object.language === languageValue
    );
  });
}

export function languageValueToSet(
  proxyContext: ProxyContext
): string | undefined {
  // Find the correct language tag
  const properLanguage = proxyContext.languageOrdering.find(
    (lang) => lang !== "@other"
  );
  // If there isn't a correct language tag, don't set anything
  if (!properLanguage) return undefined;
  return keyToLanguage(properLanguage);
}

export function filterDatasetByLanguageOrdering(
  dataset: Dataset,
  proxyContext: ProxyContext
): Dataset {
  // TODO: This is an O(n) task that could be reduced to O(1) if we cached some
  // of the processing
  const validLangs = new Set(proxyContext.languageOrdering);
  const sortedLangs: Record<string, Dataset> = {};
  dataset.forEach((quad) => {
    const literal = quad.object;
    if (isLangStringNode(literal)) {
      if (literal.language === "") {
        addToDatasetMap("@none", quad, sortedLangs);
      } else if (validLangs.has(literal.language)) {
        addToDatasetMap(literal.language, quad, sortedLangs);
      } else {
        addToDatasetMap("@other", quad, sortedLangs);
      }
    }
  });
  for (const language of proxyContext.languageOrdering) {
    if (sortedLangs[language]) {
      return sortedLangs[language];
    }
  }
  return createDataset();
}

export function keyToLanguage(key: string | symbol): string {
  return (key === "@none" ? "" : key) as string;
}
