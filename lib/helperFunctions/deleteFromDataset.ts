import { Dataset, Term } from "@rdfjs/types";
import { ContextUtil } from "../ContextUtil";
import { ObjectWithId } from "../createSubjectHandler";
import { namedNode, quad } from "@rdfjs/data-model";

export function deleteValueFromDataset(
  target: ObjectWithId,
  key: string | symbol,
  dataset: Dataset,
  contextUtil: ContextUtil
) {
  const nodesToRemove: Term[] = [];
  if (key === "@context") {
    return true;
  }
  if (key === "toString" || key === Symbol.toStringTag) {
    return true;
  }
  if (typeof key === "symbol") {
    return true;
  }
  const subject = target["@id"];
  const predicate = namedNode(contextUtil.keyToIri(key));
  if (key === "@id") {
    nodesToRemove.push(target["@id"]);
  } else {
    const objectDataset = dataset.match(subject, predicate);
    if (objectDataset.size === 0) {
      return true;
    } else {
      nodesToRemove.push(...objectDataset.toArray().map((quad) => quad.object));
    }
  }
  nodesToRemove.forEach((term) => {
    if (term.termType === "Literal") {
      dataset.delete(quad(subject, predicate, term));
      return true;
    } else if (term.termType === "NamedNode") {
      dataset.deleteMatches(term, undefined, undefined);
      dataset.deleteMatches(undefined, undefined, term);
      return true;
    }
  });
  return true;
}
