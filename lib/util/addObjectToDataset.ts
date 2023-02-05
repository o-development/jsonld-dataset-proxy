import { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { namedNode, literal, quad, blankNode } from "@rdfjs/data-model";
import { ContextUtil } from "../ContextUtil";
import { ProxyContext, _getUnderlyingNode } from "../types";
import { SubjectProxy } from "../subjectProxy/SubjectProxy";

export type AddObjectItem = {
  "@id"?: string | NamedNode | BlankNode;
  [_getUnderlyingNode]?: NamedNode | BlankNode;
} & {
  [key: string]: AddObjectValue | AddObjectValue[];
};

export type AddObjectValue = string | boolean | number | AddObjectItem;

export function getIdNode(
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

export function getNodeFromAddObjectValue(
  value: AddObjectValue,
  proxyContext: ProxyContext,
  key?: string
): BlankNode | NamedNode | Literal | undefined {
  // Get the Object Node
  if (value == undefined) {
    return undefined;
  } else if (
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number"
  ) {
    if (!key) {
      return literal(value.toString());
    }
    const datatype = proxyContext.contextUtil.getType(key);
    if (datatype === "@id") {
      return namedNode(value.toString());
    } else {
      return literal(value.toString(), datatype);
    }
  } else {
    return getIdNode(value, proxyContext.contextUtil);
  }
}

export function addObjectValueToDatasetRecurse(
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
  const object = getNodeFromAddObjectValue(value, proxyContext, key);
  if (object == undefined) {
    dataset.deleteMatches(subject, predicate);
  } else if (object.termType === "Literal") {
    proxyContext.dataset.add(quad(subject, predicate, object));
  } else {
    // Delete any triples if the id is the same
    if (
      !visitedObjects.has(nodeToSetKey(object)) &&
      !(value as AddObjectItem)[_getUnderlyingNode]
    ) {
      proxyContext.dataset.deleteMatches(object, undefined, undefined);
    }
    proxyContext.dataset.add(quad(subject, predicate, object));
    if (!(value as AddObjectItem)[_getUnderlyingNode]) {
      const updateData: AddObjectItem = (
        typeof value === "object"
          ? { ...value, "@id": object }
          : { "@id": object }
      ) as AddObjectItem;
      addObjectToDatasetRecurse(
        updateData,
        visitedObjects,
        shouldDeleteOldTriples,
        proxyContext
      );
    }
  }
}

export function addObjectToDatasetRecurse(
  item: AddObjectItem,
  visitedObjects: Set<string>,
  shouldDeleteOldTriples: boolean,
  proxyContext: ProxyContext
): SubjectProxy {
  const { dataset } = proxyContext;
  const subject = getIdNode(item, proxyContext.contextUtil);
  if (visitedObjects.has(nodeToSetKey(subject))) {
    return proxyContext.proxyCreator.createSubjectProxy(subject, proxyContext);
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
        addObjectValueToDatasetRecurse(
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
      addObjectValueToDatasetRecurse(
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
  return proxyContext.proxyCreator.createSubjectProxy(subject, proxyContext);
}

export function addObjectToDataset(
  item: AddObjectItem,
  shouldDeleteOldTriples: boolean,
  proxyContext: ProxyContext
): SubjectProxy {
  return addObjectToDatasetRecurse(
    item,
    new Set(),
    shouldDeleteOldTriples,
    proxyContext
  );
}
