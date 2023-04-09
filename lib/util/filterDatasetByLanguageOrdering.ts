import { Dataset, Quad } from "@rdfjs/types";
import { createDataset } from "o-dataset-pack";
import { ProxyContext } from "../ProxyContext";

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
    if (
      literal.termType === "Literal" &&
      (literal.datatype.value ===
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString" ||
        literal.datatype.value === "http://www.w3.org/2001/XMLSchema#string")
    ) {
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
