import { BlankNode, Dataset, NamedNode } from "@rdfjs/types";
import { ContextDefinition } from "jsonld";
import {
  GraphType,
  _getUnderlyingDataset,
  _getUnderlyingNode,
  _readGraphs,
  _writeGraphs,
} from "../types";

export type SubjectProxy = {
  "@id"?: string;
  "@context": ContextDefinition;
  [key: string | number | symbol]: unknown;
  [_getUnderlyingDataset]: Dataset;
  [_getUnderlyingNode]: NamedNode | BlankNode;
  [_writeGraphs]: GraphType[];
  [_readGraphs]: GraphType[];
};
