import { getSubjectProxyFromObject } from "./subjectProxy/isSubjectProxy";
import { GraphType, ObjectLike, _proxyContext, _writeGraphs } from "./types";

interface InteractOptions {
  using(...objects: ObjectLike[]): () => void;
  usingCopy<T extends ObjectLike>(...objects: T[]): T[];
}

export function write(...graphs: GraphType[]): InteractOptions {
  return {
    using(...objects: ObjectLike[]): () => void {
      const onEndFunctions: (() => void)[] = [];
      objects.forEach((object) => {
        const proxy = getSubjectProxyFromObject(object);
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
    usingCopy<T extends ObjectLike>(..._objects: T[]): T[] {
      throw new Error("Not Implemented");
    },
  };
}

export function read(..._graphs: GraphType[]): InteractOptions {
  return {
    using(..._objects: ObjectLike[]): () => void {
      throw new Error("Not Implemented");
    },
    usingCopy<T extends ObjectLike>(..._objects: T[]): T[] {
      throw new Error("Not Implemented");
    },
  };
}

export function interact(..._graphs: GraphType[]): InteractOptions {
  return {
    using(..._objects: ObjectLike[]): () => void {
      throw new Error("Not Implemented");
    },
    usingCopy<T extends ObjectLike>(..._objects: T[]): T[] {
      throw new Error("Not Implemented");
    },
  };
}
