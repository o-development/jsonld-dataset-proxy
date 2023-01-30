import { jsonldDatasetProxy } from "./jsonldDatasetProxy";
import {
  _getUnderlyingContext,
  _getUnderlyingDataset,
  _getUnderlyingNode,
  _getWritesToGraph,
  JsonldDatasetProxy,
  ObjectLike,
} from "./JsonldDatasetProxyType";
import { ProxyContext } from "./ProxyContext";

/**
 * readFromGraph allows you to specify an array of graphs to limit reads to. If
 * a quad is not in a specified graph, it will be treated as undefined
 * @param input a JSON Dataset Proxy
 * @param graphs the graphs to limit data retrieval to
 * @return the inputted value, but with data filtered for the specified graph
 */
export function readFromGraphs<T extends JsonldDatasetProxy<ObjectLike>>(
  input: T,
  graphs: ProxyContext["readsFromGraphs"]
): T {
  const dataset = input[_getUnderlyingDataset];
  const context = input[_getUnderlyingContext];
  const entryNode = input[_getUnderlyingNode];
  const writesToGraph = input[_getWritesToGraph];
  return jsonldDatasetProxy(
    dataset,
    context,
    entryNode,
    graphs,
    writesToGraph
  ) as T;
}
