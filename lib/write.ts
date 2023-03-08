import { getSubjectProxyFromObject } from "./subjectProxy/isSubjectProxy";
import {
  GraphType,
  ObjectLike,
  _getUnderlyingNode,
  _proxyContext,
  _writeGraphs,
} from "./types";
import { getProxyFromObject } from "./util/isProxy";

interface InteractOptions {
  /**
   * Given a dataset proxy, this makes all write actions to the dataset proxy
   * occur on the given graph.
   * @param objects Any number of dataset proxies
   * @returns void
   */
  using(...objects: ObjectLike[]): () => void;
  /**
   * Given a dataset proxy this will return a dataset proxy where all write
   * operation will occur on the given graph. The original proxy is unmodified.
   * @param objects Any number of dataset proxies
   * @returns cloned dataset proxies
   */
  usingCopy<T extends ObjectLike>(...objects: T[]): T[];
}

/**
 * Set the graphs that should be written to
 * @param graphs The graphs that should be written to
 * @returns a write builder
 */
export function write(...graphs: GraphType[]): InteractOptions {
  return {
    using(...objects: ObjectLike[]): () => void {
      const onEndFunctions: (() => void)[] = [];
      objects.forEach((object) => {
        const proxy = getProxyFromObject(object);
        const oldProxyContext = proxy[_proxyContext];
        proxy[_proxyContext] = proxy[_proxyContext].duplicate({
          writeGraphs: graphs,
        });
        onEndFunctions.push(() => {
          proxy[_proxyContext] = oldProxyContext;
        });
      });
      return function endWrite() {
        onEndFunctions.forEach((func) => func());
      };
    },
    usingCopy<T extends ObjectLike>(...objects: T[]): T[] {
      return objects.map((object) => {
        const proxy = getSubjectProxyFromObject(object);
        const newProxyContext = proxy[_proxyContext].duplicate({
          writeGraphs: graphs,
        });
        return newProxyContext.createSubjectProxy(
          proxy[_getUnderlyingNode]
        ) as unknown as T;
      });
    },
  };
}
