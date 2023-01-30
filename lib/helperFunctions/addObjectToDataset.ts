import { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { namedNode, literal, quad, blankNode } from "@rdfjs/data-model";
import { ContextUtil } from "../ContextUtil";
import { _getUnderlyingNode } from "../JsonldDatasetProxyType";
import { ProxyContext } from "../ProxyContext";

export type AddObjectItem = {
  "@id"?: string | NamedNode | BlankNode;
  [_getUnderlyingNode]?: NamedNode | BlankNode;
} & {
  [key: string]: AddObjectValue | AddObjectValue[];
};

export type AddObjectValue = string | boolean | number | AddObjectItem;

function getIdNode(
  item: AddObjectItem,
  contextUtil: ContextUtil
): NamedNode | BlankNode {
  if (item[_getUnderlyingNode]) {
    return item[_getUnderlyingNode] as NamedNode | BlankNode;
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
  key: string,
  visitedObjects: Set<string>,
  subject: NamedNode | BlankNode,
  predicate: NamedNode,
  value: AddObjectValue,
  shouldDeleteOldTriples: boolean,
  proxyContext: ProxyContext
): void {
  const { dataset } = proxyContext;
  // Get the Object Node
  let object: NamedNode | Literal | BlankNode;
  if (value == undefined) {
    dataset.deleteMatches(subject, predicate);
  } else if (
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number"
  ) {
    const datatype = proxyContext.contextUtil.getType(key);
    if (datatype === "@id") {
      object = namedNode(value.toString());
    } else {
      object = literal(value.toString(), datatype);
    }
    proxyContext.dataset.add(quad(subject, predicate, object));
  } else {
    object = getIdNode(value, proxyContext.contextUtil);

    // Delete any triples if the id is the same
    if (
      !visitedObjects.has(nodeToSetKey(object)) &&
      !value[_getUnderlyingNode]
    ) {
      proxyContext.dataset.deleteMatches(object, undefined, undefined);
    }
    proxyContext.dataset.add(quad(subject, predicate, object));
    if (!value[_getUnderlyingNode]) {
      addObjectToDataset(
        { ...value, "@id": object } as AddObjectItem,
        visitedObjects,
        shouldDeleteOldTriples,
        proxyContext
      );
    }
  }
}

export function addObjectToDataset(
  item: AddObjectItem,
  visitedObjects: Set<string>,
  shouldDeleteOldTriples: boolean,
  proxyContext: ProxyContext
): void {
  const { dataset } = proxyContext;
  const subject = getIdNode(item, proxyContext.contextUtil);
  if (visitedObjects.has(nodeToSetKey(subject))) {
    return;
  }
  visitedObjects.add(nodeToSetKey(subject));
  Object.entries(item).forEach(([key, value]) => {
    if (key === "@id") {
      return;
    }
    const predicate = namedNode(proxyContext.contextUtil.keyToIri(key));
    if (shouldDeleteOldTriples && !item[_getUnderlyingNode]) {
      dataset.deleteMatches(subject, predicate);
    }
    if (Array.isArray(value)) {
      value.forEach((valueItem) => {
        addObjectValueToDataset(
          key,
          visitedObjects,
          subject,
          predicate,
          valueItem,
          true,
          proxyContext
        );
      });
    } else {
      addObjectValueToDataset(
        key,
        visitedObjects,
        subject,
        predicate,
        value as AddObjectValue,
        true,
        proxyContext
      );
    }
  });
}
