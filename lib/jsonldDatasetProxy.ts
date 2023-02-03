import { blankNode, namedNode } from "@rdfjs/data-model";
import { BlankNode, Dataset, NamedNode } from "@rdfjs/types";
import { ContextDefinition } from "jsonld";
import { ContextUtil } from "./ContextUtil";
import { JsonldDatasetProxy, ObjectLike } from "./JsonldDatasetProxyType";
import { ProxyContext } from "./ProxyContext";
import { ProxyCreator } from "./ProxyCreator";
import { QuadMatch } from "./QuadMatch";

/**
 * Helps build JSON LD Dataset Proxies for a specific dataset and context
 */
export class JsonldDatasetProxyBuilder {
  private proxyContext: ProxyContext;

  constructor(proxyContext: ProxyContext) {
    this.proxyContext = proxyContext;
  }

  /**
   * Creates a JSON LD Dataset Proxy that matches the given subject
   * @param subject The node to match
   */
  fromSubject<T extends ObjectLike>(
    subject: NamedNode | BlankNode
  ): JsonldDatasetProxy<T> {
    return this.proxyContext.proxyCreator.createSubjectProxy(
      subject,
      this.proxyContext
    ) as unknown as JsonldDatasetProxy<T>;
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
  ): JsonldDatasetProxy<T[]> {
    return this.proxyContext.proxyCreator.createArrayProxy(
      [null, predicate, object, graph],
      this.proxyContext
    ) as unknown as JsonldDatasetProxy<T[]>;
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
  ): JsonldDatasetProxy<T[]> {
    return this.proxyContext.proxyCreator.createArrayProxy(
      [subject, predicate, null, graph],
      this.proxyContext
    ) as unknown as JsonldDatasetProxy<T[]>;
  }

  /**
   * Takes a given object and places it in the dataset while returning a JSON LD
   * Dataset Proxy representing the object.
   *
   * @param inputData Initial Data
   * @param graph Optional graph to save this data to
   */
  fromJson<T extends ObjectLike>(
    inputData: T,
    _graph: QuadMatch[3]
  ): JsonldDatasetProxy<T> {
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
  const proxyCreator = new ProxyCreator();

  const proxyContext: ProxyContext = {
    dataset: inputDataset,
    contextUtil,
    proxyCreator,
  };
  return new JsonldDatasetProxyBuilder(proxyContext);
}
