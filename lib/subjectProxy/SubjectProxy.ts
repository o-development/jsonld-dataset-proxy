import { BlankNode, Dataset, NamedNode } from "@rdfjs/types";
import { ContextDefinition } from "jsonld";
import { _getUnderlyingDataset, _getUnderlyingNode } from "../types";

export type SubjectProxy = {
  "@id"?: string;
  "@context": ContextDefinition;
  [key: string | number | symbol]: unknown;
  [_getUnderlyingDataset]: Dataset;
  [_getUnderlyingNode]: NamedNode | BlankNode;
};
