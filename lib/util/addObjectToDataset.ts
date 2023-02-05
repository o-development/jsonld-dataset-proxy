import { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { namedNode, literal, quad, blankNode } from "@rdfjs/data-model";
import { ContextUtil } from "../ContextUtil";
import { ProxyContext, _getUnderlyingNode } from "../types";
import { SubjectProxy } from "../subjectProxy/SubjectProxy";

export type RawObject =
  | ({
      "@id"?: string | NamedNode | BlankNode;
    } & {
      [key: string | symbol | number]: RawValue | RawValue[];
    })
  | SubjectProxy;

export type RawValue = string | boolean | number | RawObject;

function nodeToSetKey(node: NamedNode | BlankNode): string {
  if (node.termType === "NamedNode") {
    return `NamedNode${node.value}`;
  } else {
    return `BlankNode${node.value}`;
  }
}

export function getNodeFromRawObject(
  item: RawObject,
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

export function getNodeFromRawValue(
  key: string,
  value: RawValue,
  proxyContext: ProxyContext
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
    return getNodeFromRawObject(value, proxyContext.contextUtil);
  }
}

export function addRawValueToDatasetRecursive(
  subject: NamedNode | BlankNode,
  key: string,
  value: RawValue,
  visitedObjects: Set<string>,
  shouldDeleteOldTriples: boolean,
  proxyContext: ProxyContext
): void {
  const { dataset, contextUtil } = proxyContext;
  const predicate = namedNode(contextUtil.keyToIri(key));
  // Get the Object Node
  const object = getNodeFromRawValue(key, value, proxyContext);
  if (object == undefined) {
    dataset.deleteMatches(subject, predicate);
  } else if (object.termType === "Literal") {
    proxyContext.dataset.add(quad(subject, predicate, object));
  } else {
    // Delete any triples if the id is the same
    if (
      !visitedObjects.has(nodeToSetKey(object)) &&
      !(value as RawObject)[_getUnderlyingNode]
    ) {
      dataset.deleteMatches(object, undefined, undefined);
    }
    dataset.add(quad(subject, predicate, object));
    if (!(value as RawObject)[_getUnderlyingNode]) {
      const updateData: RawObject = (
        typeof value === "object"
          ? { ...value, "@id": object }
          : { "@id": object }
      ) as RawObject;
      addRawObjectToDatasetRecursive(
        updateData,
        visitedObjects,
        shouldDeleteOldTriples,
        proxyContext
      );
    }
  }
}

export function addRawObjectToDatasetRecursive(
  item: RawObject,
  visitedObjects: Set<string>,
  shouldDeleteOldTriples: boolean,
  proxyContext: ProxyContext
): SubjectProxy {
  const { dataset } = proxyContext;
  const subject = getNodeFromRawObject(item, proxyContext.contextUtil);
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
        addRawValueToDatasetRecursive(
          subject,
          key,
          valueItem,
          visitedObjects,
          true,
          proxyContext
        );
      });
    } else {
      addRawValueToDatasetRecursive(
        subject,
        key,
        value as RawValue,
        visitedObjects,
        true,
        proxyContext
      );
    }
  });
  return proxyContext.proxyCreator.createSubjectProxy(subject, proxyContext);
}

export function addObjectToDataset(
  item: RawObject,
  shouldDeleteOldTriples: boolean,
  proxyContext: ProxyContext
): SubjectProxy {
  return addRawObjectToDatasetRecursive(
    item,
    new Set(),
    shouldDeleteOldTriples,
    proxyContext
  );
}
