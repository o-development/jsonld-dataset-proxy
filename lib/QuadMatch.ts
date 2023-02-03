import { BlankNode, DefaultGraph, NamedNode } from "@rdfjs/types";

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
