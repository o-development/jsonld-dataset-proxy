import { BlankNode, NamedNode } from "@rdfjs/types";
import { namedNode, quad } from "@rdfjs/data-model";
import { _getUnderlyingNode } from "../types";
import { SubjectProxy } from "../subjectProxy/SubjectProxy";
import { getNodeFromRawObject, getNodeFromRawValue } from "./getNodeFromRaw";
import { RawObject, RawValue } from "./RawObject";
import { ProxyContext } from "../ProxyContext";

function nodeToSetKey(node: NamedNode | BlankNode): string {
  if (node.termType === "NamedNode") {
    return `NamedNode${node.value}`;
  } else {
    return `BlankNode${node.value}`;
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
    return proxyContext.createSubjectProxy(subject);
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
  return proxyContext.createSubjectProxy(subject);
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
