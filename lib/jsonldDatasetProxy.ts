import { Dataset, NamedNode } from "@rdfjs/types";
import { ContextUtil } from "./ContextUtil";
import { ProxyCreator } from "./ProxyCreator";
import { ShapeDefinition } from "./typeDescription/shapeDefinition";

export async function jsonldDatasetProxy<Type>(
  inputDataset: Dataset,
  shapeDefinition: ShapeDefinition<Type>,
  entryNode: NamedNode
): Promise<Type> {
  const contextUtil = new ContextUtil(shapeDefinition.context);
  const proxyCreator = new ProxyCreator();

  return proxyCreator.createSubjectProxy(
    entryNode.value,
    inputDataset,
    contextUtil
  ) as unknown as Type;
}
