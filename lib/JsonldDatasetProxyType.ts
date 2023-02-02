import { BlankNode, Dataset, NamedNode } from "@rdfjs/types";
import { ContextDefinition } from "jsonld";
import { ArrayProxyTarget } from "./createArrayHandler";

export const _getUnderlyingNode = Symbol("_getUnderlyingNode");
export const _getUnderlyingMatch = Symbol("_getUnderlyingMatch");
export const _getUnderlyingDataset = Symbol("_getUnderlyingDataset");
export const _getUnderlyingContext = Symbol("_getUnderlyingContext");

type JsonldDatasetProxyObjectAdditionalFields = {
  "@id"?: string;
  "@context"?: ContextDefinition;
  [_getUnderlyingDataset]: Dataset;
  [_getUnderlyingNode]: NamedNode | BlankNode;
  [_getUnderlyingContext]: ContextDefinition;
};

type JsonldDatasetProxyArrayAdditionalFields = {
  [_getUnderlyingDataset]: Dataset;
  [_getUnderlyingMatch]: ArrayProxyTarget[0];
  [_getUnderlyingContext]: ContextDefinition;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectLike = Record<string | number | symbol, any>;

export type JsonldDatasetProxy<Type> = Type extends ObjectLike | Array<unknown>
  ? Type extends Array<infer SubType>
    ? Array<JsonldDatasetProxy<SubType>> &
        JsonldDatasetProxyArrayAdditionalFields
    : {
        [Key in keyof Type]: JsonldDatasetProxy<Type[Key]>;
      } & JsonldDatasetProxyObjectAdditionalFields
  : Type;
