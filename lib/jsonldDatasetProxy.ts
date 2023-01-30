import { defaultGraph } from "@rdfjs/data-model";
import { BlankNode, Dataset, NamedNode } from "@rdfjs/types";
import { ContextDefinition } from "jsonld";
import { ContextUtil } from "./ContextUtil";
import { JsonldDatasetProxy, ObjectLike } from "./JsonldDatasetProxyType";
import { ProxyContext } from "./ProxyContext";
import { ProxyCreator } from "./ProxyCreator";

/**
 * Creates a JSON-LD Dataset Proxy
 *
 * @param inputDataset the source dataset
 * @param context JSON-LD Context
 * @param entryNode A node representing the subject of the returned object
 * @param readsFromGraphs A list of graphs to restrict reads to. If none are provided all graphs will be read from
 * @param writesToGraph The graph to write to. Defaults to Default Graph.
 * @returns a JSON-LD Dataset proxy
 */
export function jsonldDatasetProxy<Type extends ObjectLike>(
  inputDataset: Dataset,
  context: ContextDefinition,
  entryNode: NamedNode | BlankNode,
  readsFromGraphs: ProxyContext["readsFromGraphs"] = [],
  writesToGraph: ProxyContext["writesToGraph"] = defaultGraph()
): JsonldDatasetProxy<Type> {
  const contextUtil = new ContextUtil(context);
  const proxyCreator = new ProxyCreator();

  return proxyCreator.createSubjectProxy(entryNode, {
    dataset: inputDataset,
    contextUtil,
    readsFromGraphs,
    writesToGraph,
    proxyCreator,
  }) as unknown as JsonldDatasetProxy<Type>;
}
