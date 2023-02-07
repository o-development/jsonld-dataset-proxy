import {
  ObjectLike,
  _getUnderlyingDataset,
  _getUnderlyingNode,
  _readGraphs,
  _writeGraphs,
} from "../types";
import { SubjectProxy } from "./SubjectProxy";

export function getSubjectProxyFromObject(object: ObjectLike): SubjectProxy {
  const potentialSubjectProxy = object as SubjectProxy;
  if (
    typeof potentialSubjectProxy[_writeGraphs] !== "object" ||
    typeof potentialSubjectProxy[_readGraphs] !== "object" ||
    typeof potentialSubjectProxy[_getUnderlyingDataset] !== "object" ||
    typeof potentialSubjectProxy[_getUnderlyingNode] !== "object"
  ) {
    throw new Error(`${object} is not a Jsonld Dataset Proxy`);
  }
  return potentialSubjectProxy;
}
