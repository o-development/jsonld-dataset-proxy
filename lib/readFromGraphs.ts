import { BlankNode, DefaultGraph, NamedNode } from "@rdfjs/types";

/**
 * readFromGraph allows you to specify an array of graphs to limit reads to. If
 * a quad is not in a specified graph, it will be treated as undefined
 * @param input a JSON Dataset Proxy
 * @param graphs the graphs to limit data retrieval to
 * @return the inputted value, but with data filtered for the specified graph
 */
export function readFromGraphs<T>(
  input: T,
  graphs: (NamedNode | BlankNode | DefaultGraph)[]
): T {
  // TODO
  throw new Error("Not Implemented");
}
