import { Dataset } from "@rdfjs/types";
import { ContextUtil } from "./ContextUtil";
import { objectToJsonldRepresentation } from "./objectToJsonRepresentation";
import { ProxyCreator } from "./ProxyCreator";

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
  };
}
