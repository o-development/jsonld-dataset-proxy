import { Dataset } from "@rdfjs/types";
import { ArrayProxyTarget } from "./createArrayHandler";
import {
  ObjectType,
  _getNodeAtIndex,
  _getUnderlyingArrayTarget,
  _getUnderlyingDataset,
  _getUnderlyingMatch,
  _getUnderlyingNode,
  _proxyContext,
} from "../types";
import { ProxyContext } from "../ProxyContext";

export type ArrayProxy = Array<unknown> & {
  readonly [_getUnderlyingDataset]: Dataset;
  readonly [_getUnderlyingMatch]: ArrayProxyTarget[0];
  readonly [_getNodeAtIndex]: (index: number) => ObjectType | undefined;
  readonly [_getUnderlyingArrayTarget]: ArrayProxyTarget;
  [_proxyContext]: ProxyContext;
};
