import {
  BlankNode,
  Dataset,
  DefaultGraph,
  NamedNode,
  Term,
} from "@rdfjs/types";
import { createDataset } from "o-dataset-pack";

/**
 * Performs the identical function of dataset.match, but allows for an array of
 * graphs
 */
export function matchWithGraphArray(
  dataset: Dataset,
  subject?: Term | null | undefined,
  predicate?: Term | null | undefined,
  object?: Term | null | undefined,
  graphs?: (BlankNode | NamedNode | DefaultGraph)[]
): Dataset {
  if (!graphs || graphs.length === 0) {
    return dataset.match(subject, predicate, object);
  }
  return graphs.reduce<Dataset>((aggDataset, graph) => {
    return aggDataset.union(dataset.match(subject, predicate, object, graph));
  }, createDataset());
}
