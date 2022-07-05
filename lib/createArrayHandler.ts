import { BlankNode, Dataset, NamedNode } from "@rdfjs/types";
import { addObjectToDataset } from "./helperFunctions/addObjectToDataset";
import { ContextUtil } from "./ContextUtil";
import {
  ObjectJsonRepresentation,
  objectToJsonldRepresentation,
} from "./helperFunctions/objectToJsonRepresentation";
import { ProxyCreator } from "./ProxyCreator";
import { quad } from "@rdfjs/data-model";
import {
  ArrayMethodBuildersType,
  arrayMethodsBuilders,
  methodNames,
} from "./helperFunctions/arrayMethods";

export type QuadMatch = [subject: NamedNode | BlankNode, predicate: NamedNode];

export type ArrayProxyTarget = [
  quadMatch: QuadMatch,
  curArray: ObjectJsonRepresentation[]
];

function getProcessedObjects(
  dataset: Dataset,
  contextUtil: ContextUtil,
  proxyCreator: ProxyCreator,
  target: ArrayProxyTarget
): ObjectJsonRepresentation[] {
  const objects = dataset.match(...target[0]);
  const datasetObjects = new Set(
    objects.toArray().map((quad) => {
      return objectToJsonldRepresentation(
        quad,
        dataset,
        contextUtil,
        proxyCreator
      );
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
  dataset: Dataset,
  contextUtil: ContextUtil,
  proxyCreator: ProxyCreator
): ProxyHandler<ArrayProxyTarget> {
  return {
    get(target, key, ...rest) {
      const processedObjects = getProcessedObjects(
        dataset,
        contextUtil,
        proxyCreator,
        target
      );
      if (methodNames.has(key as keyof ArrayMethodBuildersType)) {
        return arrayMethodsBuilders[key as keyof ArrayMethodBuildersType](
          target,
          dataset,
          contextUtil
        );
      }
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
            dataset,
            contextUtil,
            new Set(),
            false
          );
          return true;
        }
      }
      return Reflect.set(target, key, ...rest);
    },
    deleteProperty(target, key) {
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
