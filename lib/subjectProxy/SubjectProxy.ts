import { BlankNode, Dataset, NamedNode } from "@rdfjs/types";
import { ContextDefinition } from "jsonld";
import { ProxyContext } from "../ProxyContext";
import {
  GraphType,
  _getUnderlyingDataset,
  _getUnderlyingNode,
  _proxyContext,
  _writeGraphs,
} from "../types";

export type SubjectProxy = {
  "@id"?: string;
  "@context": ContextDefinition;
  readonly [key: string | number | symbol]: unknown;
  readonly [_getUnderlyingDataset]: Dataset;
  readonly [_getUnderlyingNode]: NamedNode | BlankNode;
  [_proxyContext]: ProxyContext;
  readonly [_writeGraphs]: GraphType[];
};
