import { defaultGraph } from "@rdfjs/data-model";
import { Dataset } from "@rdfjs/types";
import { ContextDefinition } from "jsonld";
import { ContextUtil } from "./ContextUtil";
import { JsonldDatasetProxyBuilder } from "./JsonldDatasetProxyBuilder";
import { ProxyContext } from "./ProxyContext";

/**
 * Creates a JSON-LD Dataset Proxy
 *
 * @param inputDataset the source dataset
 * @param context JSON-LD Context
 * @returns a JSON-LD Dataset proxy
 */
export function jsonldDatasetProxy(
  inputDataset: Dataset,
  context: ContextDefinition
): JsonldDatasetProxyBuilder {
  const contextUtil = new ContextUtil(context);
  const proxyContext = new ProxyContext({
    dataset: inputDataset,
    contextUtil,
    readGraphs: [],
    writeGraphs: [defaultGraph()],
  });
  return new JsonldDatasetProxyBuilder(proxyContext);
}
