import { BlankNode, Dataset, NamedNode } from "@rdfjs/types";
import { ContextUtil } from "./ContextUtil";
import { ProxyCreator } from "./ProxyCreator";
import { ShapeDefinition } from "./typeDescription/shapeDefinition";

export async function jsonldDatasetProxy<Type>(
  inputDataset: Dataset,
  shapeDefinition: ShapeDefinition<Type>,
  entryNode: NamedNode | BlankNode
): Promise<Type> {
  const contextUtil = new ContextUtil(shapeDefinition.context);
  const proxyCreator = new ProxyCreator();

  return proxyCreator.createSubjectProxy(
    entryNode,
    inputDataset,
    contextUtil
  ) as unknown as Type;
}
