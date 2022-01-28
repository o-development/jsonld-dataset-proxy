import { Dataset, NamedNode } from "@rdfjs/types";
import { addObjectToDataset } from "./addObjectToDataset";
import { ContextUtil } from "./ContextUtil";
import { objectToJsonldRepresentation } from "./objectToJsonRepresentation";
import { ProxyCreator } from "./ProxyCreator";
import { quad } from "@rdfjs/dataset";

export type QuadMatch = Parameters<Dataset["match"]>;

function getProcessedObjects(
  dataset: Dataset,
  contextUtil: ContextUtil,
  proxyCreator: ProxyCreator,
  target: QuadMatch
) {
  const objects = dataset.match(...target);
  const processedObjects = objects.toArray().map((quad) => {
    return objectToJsonldRepresentation(
      quad,
      dataset,
      contextUtil,
      proxyCreator
    );
  });
  return processedObjects;
}

export function createArrayHandler(
  dataset: Dataset,
  contextUtil: ContextUtil,
  proxyCreator: ProxyCreator
): ProxyHandler<QuadMatch> {
  return {
    get(target, key, ...rest) {
      const processedObjects = getProcessedObjects(
        dataset,
        contextUtil,
        proxyCreator,
        target
      );
      return Reflect.get(processedObjects, key, ...rest);
    },
    getOwnPropertyDescriptor(target, key, ...rest) {
      const processedObjects = getProcessedObjects(
        dataset,
        contextUtil,
        proxyCreator,
        target
      );
      return Reflect.getOwnPropertyDescriptor(processedObjects, key, ...rest);
    },
    ownKeys(target, ...rest) {
      const processedObjects = getProcessedObjects(
        dataset,
        contextUtil,
        proxyCreator,
        target
      );
      return Reflect.ownKeys(processedObjects, ...rest);
    },
    getPrototypeOf(target, ...rest) {
      const processedObjects = getProcessedObjects(
        dataset,
        contextUtil,
        proxyCreator,
        target
      );
      return Reflect.getPrototypeOf(processedObjects, ...rest);
    },
    has(target, ...rest) {
      const processedObjects = getProcessedObjects(
        dataset,
        contextUtil,
        proxyCreator,
        target
      );
      return Reflect.has(processedObjects, ...rest);
    },
    set(target, key, value, ...rest) {
      if (typeof key === "symbol") {
        return false;
      }
      if (!isNaN(parseInt(key as string))) {
        const objectQuad = dataset.match(...target).toArray()[parseInt(key)];
        if (objectQuad) {
          dataset.delete(objectQuad);
        }
        if (target[0] && target[1]) {
          addObjectToDataset(
            {
              "@id": target[0].value,
              [contextUtil.iriToKey(target[1].value)]: value,
            },
            dataset,
            contextUtil,
            new Set()
          );
          return true;
        }
        return false;
      }
      return Reflect.set(target, key, ...rest);
    },
    deleteProperty(target, key) {
      if (typeof key === "symbol") {
        return true;
      }
      if (!isNaN(parseInt(key as string))) {
        const objectQuad = dataset.match(...target).toArray()[parseInt(key)];
        if (!objectQuad) {
          return true;
        }
        const term = objectQuad.object;
        if (term.termType === "Literal") {
          const subject = target[0] as NamedNode;
          const predicate = target[1] as NamedNode;
          if (subject && predicate) {
            dataset.delete(quad(subject, predicate, term));
          }
          return true;
        } else if (
          term.termType === "NamedNode" ||
          term.termType === "BlankNode"
        ) {
          dataset.deleteMatches(term, undefined, undefined);
          dataset.deleteMatches(undefined, undefined, term);
          return true;
        }
      }
      return true;
    },
  };
}
