import {
  BlankNode,
  Dataset,
  NamedNode,
  Quad,
  Quad_Graph,
  Quad_Object,
  Quad_Predicate,
  Quad_Subject,
} from "@rdfjs/types";
import { ContextDefinition } from "jsonld";
import { ArrayProxyTarget } from "./createArrayHandler";
import { ProxyContext } from "./ProxyContext";

export const _getUnderlyingNode = Symbol("_getUnderlyingNode");
export const _getUnderlyingMatch = Symbol("_getUnderlyingMatch");
export const _getUnderlyingDataset = Symbol("_getUnderlyingDataset");
export const _getUnderlyingContext = Symbol("_getUnderlyingContext");
export const _getReadsFromGraphs = Symbol("_getReadsFromGraphs");
export const _getWritesToGraph = Symbol("_getWritesToGraph");
export const _quad = Symbol("_quad");
export const _subject = Symbol("_subject");
export const _predicate = Symbol("_predicate");
export const _object = Symbol("_object");
export const _graph = Symbol("_graph");

type RdfObjectGetterReturn<
  Type extends ObjectLike,
  Key extends keyof Type,
  Return
> =
  | (NonNullable<Type[Key]> extends Array<unknown> ? Return[] : Return)
  | undefined;

type JsonldDatasetProxyObjectAdditionalFields<T extends ObjectLike> = {
  "@id"?: string;
  "@context"?: ContextDefinition;
  [_getUnderlyingDataset]: Dataset;
  [_getUnderlyingNode]: NamedNode | BlankNode;
  [_getUnderlyingContext]: ContextDefinition;
  [_getReadsFromGraphs]: ProxyContext["readsFromGraphs"];
  [_getWritesToGraph]: ProxyContext["writesToGraph"];
  [_quad]<Key extends keyof T>(key: Key): RdfObjectGetterReturn<T, Key, Quad>;
  [_subject]<Key extends keyof T>(
    key: Key
  ): RdfObjectGetterReturn<T, Key, Quad_Subject>;
  [_predicate]<Key extends keyof T>(
    key: Key
  ): RdfObjectGetterReturn<T, Key, Quad_Predicate>;
  [_object]<Key extends keyof T>(
    key: Key
  ): RdfObjectGetterReturn<T, Key, Quad_Object>;
  [_graph]<Key extends keyof T>(
    key: Key
  ): RdfObjectGetterReturn<T, Key, Quad_Graph>;
};

type JsonldDatasetProxyArrayAdditionalFields = {
  [_getUnderlyingDataset]: Dataset;
  [_getUnderlyingMatch]: ArrayProxyTarget[0];
  [_getUnderlyingContext]: ContextDefinition;
  [_getReadsFromGraphs]: ProxyContext["readsFromGraphs"];
  [_getWritesToGraph]: ProxyContext["writesToGraph"];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectLike = Record<string | number | symbol, any>;

export type JsonldDatasetProxy<Type> = Type extends ObjectLike | Array<unknown>
  ? Type extends Array<infer SubType>
    ? Array<JsonldDatasetProxy<SubType>> &
        JsonldDatasetProxyArrayAdditionalFields
    : {
        [Key in Exclude<
          keyof Type,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          keyof JsonldDatasetProxyObjectAdditionalFields<any>
        >]: JsonldDatasetProxy<Type[Key]>;
      } & JsonldDatasetProxyObjectAdditionalFields<Type>
  : Type;
