import { BlankNode, Dataset, NamedNode } from "@rdfjs/types";
import { ContextDefinition } from "jsonld";
import { ArrayProxyTarget } from "./createArrayHandler";
import { ProxyContext } from "./ProxyContext";

export const getUnderlyingNode = Symbol("getUnderlyingNode");
export const getUnderlyingMatch = Symbol("getUnderlyingMatch");
export const getUnderlyingDataset = Symbol("getUnderlyingDataset");
export const getUnderlyingContext = Symbol("getUnderlyingContext");
export const getReadsFromGraphs = Symbol("getReadsFromGraphs");
export const getWritesToGraph = Symbol("getWritesToGraph");

type JsonldDatasetProxyObjectAdditionalFields = {
  "@id"?: string;
  "@context"?: ContextDefinition;
  [getUnderlyingDataset]: Dataset;
  [getUnderlyingNode]: NamedNode | BlankNode;
  [getUnderlyingContext]: ContextDefinition;
  [getReadsFromGraphs]: ProxyContext["readsFromGraphs"];
  [getWritesToGraph]: ProxyContext["writesToGraph"];
};

type JsonldDatasetProxyArrayAdditionalFields = {
  [getUnderlyingDataset]: Dataset;
  [getUnderlyingMatch]: ArrayProxyTarget[0];
  [getUnderlyingContext]: ContextDefinition;
  [getReadsFromGraphs]: ProxyContext["readsFromGraphs"];
  [getWritesToGraph]: ProxyContext["writesToGraph"];
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
