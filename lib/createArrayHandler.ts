import { BlankNode, NamedNode } from "@rdfjs/types";
import { addObjectToDataset } from "./helperFunctions/addObjectToDataset";
import {
  ObjectJsonRepresentation,
  objectToJsonldRepresentation,
} from "./helperFunctions/objectToJsonRepresentation";
import { quad } from "@rdfjs/data-model";
import {
  ArrayMethodBuildersType,
  arrayMethodsBuilders,
  methodNames,
} from "./helperFunctions/arrayMethods";
import { ProxyContext } from "./ProxyContext";
import {
  getReadsFromGraphs,
  getUnderlyingContext,
  getUnderlyingDataset,
  getUnderlyingMatch,
  getWritesToGraph,
} from "./JsonldDatasetProxyType";

export type QuadMatch = [subject: NamedNode | BlankNode, predicate: NamedNode];

export type ArrayProxyTarget = [
  quadMatch: QuadMatch,
  curArray: ObjectJsonRepresentation[]
];

function getProcessedObjects(
  target: ArrayProxyTarget,
  proxyContext: ProxyContext
): ObjectJsonRepresentation[] {
  const objects = proxyContext.dataset.match(...target[0]);
  const datasetObjects = new Set(
    objects.toArray().map((quad) => {
      return objectToJsonldRepresentation(quad, proxyContext);
    })
  );
  const processedObjects: ObjectJsonRepresentation[] = [];
  target[1].forEach((arrItem) => {
    if (datasetObjects.has(arrItem)) {
      processedObjects.push(arrItem);
      datasetObjects.delete(arrItem);
    }
  });
  Array.from(datasetObjects).forEach((datasetObject) => {
    processedObjects.push(datasetObject);
  });
  target[1] = processedObjects;

  return processedObjects;
}

export function createArrayHandler(
  proxyContext: ProxyContext
): ProxyHandler<ArrayProxyTarget> {
  return {
    get(target, key, ...rest) {
      // switch (key) {
      //   case getUnderlyingDataset:
      //     return proxyContext.dataset;
      //   case getUnderlyingMatch:
      //     return target[0];
      //   case getUnderlyingContext:
      //     return proxyContext.contextUtil.context;
      //   case getReadsFromGraphs:
      //     return proxyContext.readsFromGraphs;
      //   case getWritesToGraph:
      //     return proxyContext.writesToGraph;
      // }

      const processedObjects = getProcessedObjects(target, proxyContext);
      if (methodNames.has(key as keyof ArrayMethodBuildersType)) {
        return arrayMethodsBuilders[key as keyof ArrayMethodBuildersType](
          target,
          proxyContext
        );
      }
      return Reflect.get(processedObjects, key, ...rest);
    },
    getOwnPropertyDescriptor(target, key, ...rest) {
      const processedObjects = getProcessedObjects(target, proxyContext);
      return Reflect.getOwnPropertyDescriptor(processedObjects, key, ...rest);
    },
    ownKeys(target, ...rest) {
      const processedObjects = getProcessedObjects(target, proxyContext);
      return Reflect.ownKeys(processedObjects, ...rest);
    },
    getPrototypeOf(target, ...rest) {
      const processedObjects = getProcessedObjects(target, proxyContext);
      return Reflect.getPrototypeOf(processedObjects, ...rest);
    },
    has(target, ...rest) {
      const processedObjects = getProcessedObjects(target, proxyContext);
      return Reflect.has(processedObjects, ...rest);
    },
    set(target, key, value, ...rest) {
      const { dataset, contextUtil } = proxyContext;
      if (typeof key !== "symbol" && !isNaN(parseInt(key as string))) {
        const objectQuad = dataset.match(...target[0]).toArray()[parseInt(key)];
        if (objectQuad) {
          dataset.delete(objectQuad);
        }
        if (target[0][0] && target[0][1]) {
          addObjectToDataset(
            {
              "@id": target[0][0],
              [contextUtil.iriToKey(target[0][1].value)]: value,
            },
            new Set(),
            false,
            proxyContext
          );
          return true;
        }
      }
      return Reflect.set(target, key, ...rest);
    },
    deleteProperty(target, key) {
      const { dataset } = proxyContext;
      if (typeof key !== "symbol" && !isNaN(parseInt(key as string))) {
        const objectQuad = dataset.match(...target[0]).toArray()[parseInt(key)];
        if (!objectQuad) {
          return true;
        }
        const term = objectQuad.object;
        if (term.termType === "Literal") {
          const subject = target[0][0] as NamedNode;
          const predicate = target[0][1] as NamedNode;
          if (subject && predicate) {
            dataset.delete(quad(subject, predicate, term));
          }
          return true;
        } else if (term.termType === "NamedNode") {
          dataset.deleteMatches(term, undefined, undefined);
          dataset.deleteMatches(undefined, undefined, term);
          return true;
        }
      }
      return true;
    },
  };
}
