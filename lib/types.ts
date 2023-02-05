import { BlankNode, Dataset, DefaultGraph, NamedNode } from "@rdfjs/types";
import { ContextUtil } from "./ContextUtil";
import { ProxyCreator } from "./ProxyCreator";

export const _getUnderlyingNode = Symbol("_getUnderlyingNode");
export const _getUnderlyingMatch = Symbol("_getUnderlyingMatch");
export const _isSubjectOriented = Symbol("_isSubjectOriented");
export const _getUnderlyingDataset = Symbol("_getUnderlyingDataset");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectLike = Record<string | number | symbol, any>;

export type SubjectType = NamedNode | BlankNode;
export type PredicateType = NamedNode;
export type ObjectType = NamedNode | BlankNode;
export type GraphType = NamedNode | BlankNode | DefaultGraph;

export type QuadMatch = [
  SubjectType | undefined | null,
  PredicateType | undefined | null,
  ObjectType | undefined | null,
  GraphType | undefined | null
];

export interface ProxyContext {
  dataset: Dataset;
  contextUtil: ContextUtil;
  proxyCreator: ProxyCreator;
}
