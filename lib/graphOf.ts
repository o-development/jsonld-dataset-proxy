import { namedNode } from "@rdfjs/data-model";
import { getSubjectProxyFromObject, isSubjectProxy } from "./subjectProxy/isSubjectProxy";
import {
  GraphType,
  ObjectLike,
  ObjectType,
  _getUnderlyingDataset,
  _getUnderlyingMatch,
  _getUnderlyingNode,
  _proxyContext,
} from "./types";

/**
 * Returns the graph for which a defined triple is a member
 * @param subject A JsonldDatasetProxy that represents the subject
 * @param predicate The key on the JsonldDatasetProxy
 * @param object The direct object. This can be a JsonldDatasetProxy or the index
 * @returns a list of graphs for which the triples are members
 */
export function graphOf<Subject extends ObjectLike, Key extends keyof Subject>(
  subject: Subject,
  predicate: Key,
  object?: NonNullable<Subject[Key]> extends Array<unknown>
    ? number | ObjectLike
    : ObjectLike
): GraphType[] {
  const subjectProxy = getSubjectProxyFromObject(subject);
  const proxyContext = subjectProxy[_proxyContext];
  const subjectNode = subjectProxy[_getUnderlyingNode];
  const predicateNode = namedNode(
    proxyContext.contextUtil.keyToIri(predicate as string)
  );
  let objectNode: ObjectType | null;
  if (!object) {
    objectNode = null;
  } else if (typeof object === "number") {
    const proxyArray = subject[predicate];
    if (!proxyArray[_getUnderlyingMatch]) {
      throw new Error(
        `Key "${String(predicate)}" of ${subject} is not an array.`
      );
    }

    // PICKUP: Problem: arrays will return regular values that are not nodes, so it's not always possible to correlate these value with nodes
    // Might want to consider a _getNodeAtIndex(index) function. This will require a rewrite of the array get method
    const objectValue[object];
    if (!proxyArray[object]) {
      throw new Error(`Index ${object} does not exist.`);
    }
    if (isSubjectProxy(proxyArray[object])) {
      objectNode = proxyArray[object][1]
    }
    objectNode = proxyArray[object];
  } else {
    const objectProxy = getSubjectProxyFromObject(object);
    objectNode = objectProxy[_getUnderlyingNode];
  }
  const quads = subjectProxy[_getUnderlyingDataset].match(
    subjectNode,
    predicateNode,
    objectNode
  );
  console.log(subjectNode, predicateNode, objectNode);
  return quads.toArray().map((quad): GraphType => quad.graph as GraphType);
}
