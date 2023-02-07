import { blankNode, namedNode } from "@rdfjs/data-model";
import { BlankNode, NamedNode } from "@rdfjs/types";
import { ProxyCreator } from "./ProxyCreator";
import { GraphType, ObjectLike, ProxyContext, QuadMatch } from "./types";

/**
 * Helps build JSON LD Dataset Proxies for a specific dataset and context
 */
export class JsonldDatasetProxyBuilder {
  private proxyContext: ProxyContext;

  constructor(proxyContext: ProxyContext) {
    this.proxyContext = proxyContext;
  }

  /**
   * Designates that all Jsonld Dataset Proxies created should write to the
   * specified graphs
   */
  write(...graphs: GraphType[]): JsonldDatasetProxyBuilder {
    return new JsonldDatasetProxyBuilder({
      ...this.proxyContext,
      proxyCreator: new ProxyCreator(),
      writeGraphs: graphs,
    });
  }

  /**
   * Designates that all Jsonld Dataset Proxies created should read from the
   * specified graphs
   */
  read(...graphs: GraphType[]): JsonldDatasetProxyBuilder {
    return new JsonldDatasetProxyBuilder({
      ...this.proxyContext,
      proxyCreator: new ProxyCreator(),
      readGraphs: graphs,
    });
  }

  /**
   * Designates that all Jsonld Dataset Proxies created should read and write
   * from the specified graphs
   */
  interact(...graphs: GraphType[]): JsonldDatasetProxyBuilder {
    return new JsonldDatasetProxyBuilder({
      ...this.proxyContext,
      proxyCreator: new ProxyCreator(),
      readGraphs: graphs,
    });
  }

  /**
   * Creates a JSON LD Dataset Proxy that matches the given subject
   * @param subject The node to match
   */
  fromSubject<T extends ObjectLike>(subject: NamedNode | BlankNode): T {
    return this.proxyContext.proxyCreator.createSubjectProxy(
      subject,
      this.proxyContext
    ) as unknown as T;
  }

  /**
   * Matches Subjects to provided predicates, objects, and graphs. Returns a
   * JSON LD Dataset that can be read an modified.
   * @param predicate The predicate to match
   * @param object The object to match
   * @param graph The graph to match
   */
  matchSubject<T extends ObjectLike>(
    predicate: QuadMatch[1],
    object?: QuadMatch[2],
    graph?: QuadMatch[3]
  ): T[] {
    return this.proxyContext.proxyCreator.createArrayProxy(
      [null, predicate, object, graph],
      this.proxyContext,
      true
    ) as unknown as T[];
  }

  /**
   * Matches Objects to provided subjects, predicates, and graphs. Returns a
   * JSON LD Dataset that can be read an modified.
   * @param subject The subject to match
   * @param predicate The predicate to match
   * @param graph The graph to match
   */
  matchObject<T extends ObjectLike>(
    subject: QuadMatch[0],
    predicate: QuadMatch[1],
    graph: QuadMatch[3]
  ): T[] {
    return this.proxyContext.proxyCreator.createArrayProxy(
      [subject, predicate, null, graph],
      this.proxyContext
    ) as unknown as T[];
  }

  /**
   * Takes a given object and places it in the dataset while returning a JSON LD
   * Dataset Proxy representing the object.
   *
   * @param inputData Initial Data
   * @param graph Optional graph to save this data to
   */
  fromJson<T extends ObjectLike>(inputData: T, _graph?: QuadMatch[3]): T {
    const entryNode = inputData["@id"]
      ? namedNode(inputData["@id"])
      : blankNode();
    const proxy = this.fromSubject<T>(entryNode);
    Object.entries(inputData).forEach(([key, value]) => {
      proxy[<keyof T>key] = value;
    });
    return proxy;
  }
}
