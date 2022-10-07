import { BlankNode, Dataset, Literal, NamedNode } from "@rdfjs/types";
import { namedNode, literal, quad, blankNode } from "@rdfjs/data-model";
import { ContextUtil } from "../ContextUtil";
import { getUnderlyingNode } from "../createSubjectHandler";

export type AddObjectItem = {
  "@id"?: string | NamedNode | BlankNode;
  [getUnderlyingNode]?: NamedNode | BlankNode;
} & {
  [key: string]: AddObjectValue | AddObjectValue[];
};

export type AddObjectValue = string | boolean | number | AddObjectItem;

function getIdNode(
  item: AddObjectItem,
  contextUtil: ContextUtil
): NamedNode | BlankNode {
  if (item[getUnderlyingNode]) {
    return item[getUnderlyingNode] as NamedNode | BlankNode;
  } else if (!item["@id"]) {
    return blankNode();
  } else if (typeof item["@id"] === "string") {
    return namedNode(contextUtil.keyToIri(item["@id"]));
  } else {
    return item["@id"];
  }
}

function nodeToSetKey(node: NamedNode | BlankNode): string {
  if (node.termType === "NamedNode") {
    return `NamedNode${node.value}`;
  } else {
    return `BlankNode${node.value}`;
  }
}

export function addObjectValueToDataset(
  dataset: Dataset,
  contextUtil: ContextUtil,
  key: string,
  visitedObjects: Set<string>,
  subject: NamedNode | BlankNode,
  predicate: NamedNode,
  value: AddObjectValue,
  shouldDeleteOldTriples: boolean
): void {
  // Get the Object Node
  let object: NamedNode | Literal | BlankNode;
  if (value == undefined) {
    dataset.deleteMatches(subject, predicate);
  } else if (
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
  } else {
    object = getIdNode(value, contextUtil);

    // Delete any triples if the id is the same
    if (
      !visitedObjects.has(nodeToSetKey(object)) &&
      !value[getUnderlyingNode]
    ) {
      dataset.deleteMatches(object, undefined, undefined);
    }
    dataset.add(quad(subject, predicate, object));
    if (!value[getUnderlyingNode]) {
      addObjectToDataset(
        { ...value, "@id": object } as AddObjectItem,
        dataset,
        contextUtil,
        visitedObjects,
        shouldDeleteOldTriples
      );
    }
  }
}

export function addObjectToDataset(
  item: AddObjectItem,
  dataset: Dataset,
  contextUtil: ContextUtil,
  visitedObjects: Set<string>,
  shouldDeleteOldTriples: boolean
): void {
  const subject = getIdNode(item, contextUtil);
  if (visitedObjects.has(nodeToSetKey(subject))) {
    return;
  }
  visitedObjects.add(nodeToSetKey(subject));
  Object.entries(item).forEach(([key, value]) => {
    if (key === "@id") {
      return;
    }
    const predicate = namedNode(contextUtil.keyToIri(key));
    if (shouldDeleteOldTriples && !item[getUnderlyingNode]) {
      dataset.deleteMatches(subject, predicate);
    }
    if (Array.isArray(value)) {
      value.forEach((valueItem) => {
        addObjectValueToDataset(
          dataset,
          contextUtil,
          key,
          visitedObjects,
          subject,
          predicate,
          valueItem,
          true
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
        value as AddObjectValue,
        true
      );
    }
  });
}
