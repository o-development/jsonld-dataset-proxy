import { Dataset } from "@rdfjs/types";
import { ArrayProxyTarget } from "./createArrayHandler";
import {
  ObjectType,
  _getNodeAtIndex,
  _getUnderlyingArrayTarget,
  _getUnderlyingDataset,
  _getUnderlyingMatch,
  _getUnderlyingNode,
} from "../types";

export type ArrayProxy = Array<unknown> & {
  readonly [_getUnderlyingDataset]: Dataset;
  readonly [_getUnderlyingMatch]: ArrayProxyTarget[0];
  readonly [_getUnderlyingNode]: boolean;
  readonly [_getNodeAtIndex]: (index: number) => ObjectType | undefined;
  readonly [_getUnderlyingArrayTarget]: ArrayProxyTarget;
};
