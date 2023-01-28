import { BlankNode, DefaultGraph, NamedNode } from "@rdfjs/types";

/**
 * Changes the graph that modifications are written to
 * @param input a JSON Dataset Proxy
 * @param graph the graph to which modifications should be written
 * @return he inputted value, but all modifications will be written to the specified graph
 */
export function writeToGraph<T>(
  input: T,
  graph: NamedNode | BlankNode | DefaultGraph
): T {
  // TODO
  throw new Error("Not Implemented");
}
