import { Dataset, Literal, NamedNode, Quad } from "@rdfjs/types";
import { namedNode, literal, quad } from "@rdfjs/dataset";
import { ContextUtil } from "../ContextUtil";
import { ObjectWithId } from "../createSubjectHandler";
import { deleteValueFromDataset } from "./deleteFromDataset";

export function addObjectValueToDataset(
  dataset: Dataset,
  contextUtil: ContextUtil,
  key: string,
  visitedObjects: Set<object>,
  subject: NamedNode,
  predicate: NamedNode,
  value: unknown
): void {
  let object: NamedNode | Literal;
  if (
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number"
  ) {
    const datatype = contextUtil.getType(key);
    if (datatype === "@id") {
      object = namedNode(value.toString());
    } else {
      object = literal(value.toString(), datatype);
    }
    dataset.add(quad(subject, predicate, object));
  } else if (
    value &&
    typeof value === "object" &&
    (value as ObjectWithId)["@id"]
  ) {
    object = namedNode((value as ObjectWithId)["@id"]);
    dataset.add(quad(subject, predicate, object));
    addObjectToDataset(
      value as ObjectWithId,
      dataset,
      contextUtil,
      visitedObjects
    );
  } else {
    throw Error("Set object does not have an @id");
  }
}

export function addObjectToDataset(
  item: ObjectWithId,
  dataset: Dataset,
  contextUtil: ContextUtil,
  visitedObjects: Set<object>
): void {
  if (visitedObjects.has(item)) {
    return;
  }
  visitedObjects.add(item);
  const subject = namedNode(item["@id"]);
  Object.entries(item).forEach(([key, value]) => {
    if (key === "@id") {
      return;
    }
    const predicate = namedNode(contextUtil.keyToIri(key));
    const curQuad: Quad | undefined = dataset
      .match(subject, predicate)
      .toArray()[0];
    // Delete the entire objec if it has the same id
    if (
      curQuad &&
      curQuad.object.termType === "NamedNode" &&
      typeof value === "object" &&
      (value as ObjectWithId)["@id"] &&
      curQuad.object.value === (value as ObjectWithId)["@id"]
    ) {
      deleteValueFromDataset(item, key, dataset, contextUtil);
    }
    dataset.deleteMatches(subject, predicate);
    if (Array.isArray(value)) {
      value.forEach((valueItem) => {
        addObjectValueToDataset(
          dataset,
          contextUtil,
          key,
          visitedObjects,
          subject,
          predicate,
          valueItem
        );
      });
    } else {
      addObjectValueToDataset(
        dataset,
        contextUtil,
        key,
        visitedObjects,
        subject,
        predicate,
        value
      );
    }
  });
}
