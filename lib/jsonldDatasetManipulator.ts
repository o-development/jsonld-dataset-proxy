import { Dataset, NamedNode } from "@rdfjs/types";
import { ContextDefinition } from "jsonld";
import { toJsonld } from "./toJsonLd";
import { createHander } from "./createHandler";

export async function jsonldDatasetManipulator<JsonType>(
  inputDataset: Dataset,
  context: ContextDefinition,
  entryNode: NamedNode
): Promise<JsonType> {
  const rawJson = await toJsonld<JsonType>(inputDataset, context, entryNode);

  return new Proxy(
    rawJson as unknown as object,
    createHander(inputDataset, context)
  ) as unknown as JsonType;
}
