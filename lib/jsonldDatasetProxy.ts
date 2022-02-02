import { BlankNode, Dataset, NamedNode } from "@rdfjs/types";
import { ContextDefinition } from "jsonld";
import { ContextUtil } from "./ContextUtil";
import { ProxyCreator } from "./ProxyCreator";

type JsonldFields = {
  "@id"?: string;
  "@context"?: ContextDefinition;
};

type AugmentArray<OriginalType> = OriginalType extends Array<infer SubType>
  ? Array<JsonldDatasetProxy<SubType>>
  : JsonldDatasetProxy<OriginalType>;

type AugmentWithType<OriginalType> = undefined extends OriginalType
  ? AugmentArray<NonNullable<OriginalType>> | undefined
  : AugmentArray<OriginalType>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonldDatasetProxy<Type> = Type extends Record<string, any>
  ? {
      [Key in keyof Type]: AugmentWithType<Type[Key]>;
    } & JsonldFields
  : Type;

export function jsonldDatasetProxy<Type>(
  inputDataset: Dataset,
  context: ContextDefinition,
  entryNode: NamedNode | BlankNode
): Type {
  const contextUtil = new ContextUtil(context);
  const proxyCreator = new ProxyCreator();

  return proxyCreator.createSubjectProxy(
    entryNode,
    inputDataset,
    contextUtil
  ) as unknown as Type;
}
