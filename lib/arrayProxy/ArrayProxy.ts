import { Dataset } from "@rdfjs/types";
import { ArrayProxyTarget } from "./createArrayHandler";
import {
  _getUnderlyingDataset,
  _getUnderlyingMatch,
  _getUnderlyingNode,
} from "../types";

export type ArrayProxy = Array<unknown> & {
  [_getUnderlyingDataset]: Dataset;
  [_getUnderlyingMatch]: ArrayProxyTarget[0];
  [_getUnderlyingNode]: boolean;
};
