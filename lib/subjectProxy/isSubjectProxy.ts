import {
  ObjectLike,
  _getUnderlyingDataset,
  _getUnderlyingNode,
  _proxyContext,
  _writeGraphs,
} from "../types";
import { SubjectProxy } from "./SubjectProxy";

export function isSubjectProxy(someObject?: unknown) {
  if (!someObject) return false;
  if (typeof someObject !== "object") return false;
  const potentialSubjectProxy = someObject as SubjectProxy;
  return !(
    typeof potentialSubjectProxy[_writeGraphs] !== "object" ||
    typeof potentialSubjectProxy[_getUnderlyingDataset] !== "object" ||
    typeof potentialSubjectProxy[_getUnderlyingNode] !== "object" ||
    typeof potentialSubjectProxy[_proxyContext] !== "object"
  );
}

export function getSubjectProxyFromObject(object: ObjectLike): SubjectProxy {
  const potentialSubjectProxy = object as SubjectProxy;
  if (!isSubjectProxy(potentialSubjectProxy)) {
    throw new Error(`${object} is not a Jsonld Dataset Proxy`);
  }
  return potentialSubjectProxy;
}
