import { jsonldDatasetProxy } from "./jsonldDatasetProxy";
import {
  getReadsFromGraphs,
  getUnderlyingContext,
  getUnderlyingDataset,
  getUnderlyingNode,
  JsonldDatasetProxy,
  ObjectLike,
} from "./JsonldDatasetProxyType";
import { ProxyContext } from "./ProxyContext";

/**
 * Changes the graph that modifications are written to
 * @param input a JSON Dataset Proxy
 * @param graph the graph to which modifications should be written
 * @return he inputted value, but all modifications will be written to the specified graph
 */
export function writeToGraph<T extends JsonldDatasetProxy<ObjectLike>>(
  input: T,
  graphs: ProxyContext["writesToGraph"]
): T {
  const dataset = input[getUnderlyingDataset];
  const context = input[getUnderlyingContext];
  const entryNode = input[getUnderlyingNode];
  const readsFromGraphs = input[getReadsFromGraphs];
  return jsonldDatasetProxy(
    dataset,
    context,
    entryNode,
    readsFromGraphs,
    graphs
  ) as T;
}
