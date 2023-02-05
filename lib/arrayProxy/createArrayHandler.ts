import { BlankNode, NamedNode } from "@rdfjs/types";
import {
  ObjectJsonRepresentation,
  objectToJsonldRepresentation,
} from "../util/objectToJsonRepresentation";
import { quad } from "@rdfjs/data-model";
import {
  ArrayMethodBuildersType,
  arrayMethodsBuilders,
  methodNames,
} from "./arrayMethods";
import {
  ProxyContext,
  QuadMatch,
  _getUnderlyingDataset,
  _getUnderlyingMatch,
  _isSubjectOriented,
} from "../types";
import { modifyArray } from "./modifyArray";

export type ArrayProxyTarget = [
  quadMatch: QuadMatch,
  curArray: ObjectJsonRepresentation[],
  isSubjectOriented?: boolean
];

function getProcessedObjects(
  target: ArrayProxyTarget,
  proxyContext: ProxyContext
): ObjectJsonRepresentation[] {
  const quads = proxyContext.dataset.match(...target[0]);
  const datasetObjects = new Set(
    quads.toArray().map((quad) => {
      // If this this a subject-oriented document
      if (target[2]) {
        return proxyContext.proxyCreator.createSubjectProxy(
          quad.subject as NamedNode | BlankNode,
          proxyContext
        );
      }
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
      switch (key) {
        case _getUnderlyingDataset:
          return proxyContext.dataset;
        case _getUnderlyingMatch:
          return target[0];
        case _isSubjectOriented:
          return target[2];
      }

      // TODO: Because of this, every get operation is O(n). Consider changing
      // this
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
      getProcessedObjects(target, proxyContext);
      if (typeof key !== "symbol" && !isNaN(parseInt(key as string))) {
        const index = parseInt(key);
        return modifyArray(
          {
            target,
            toAdd: [value],
            quadsToDelete(allQuads) {
              return allQuads[index] ? [allQuads[index]] : [];
            },
            modifyCoreArray(coreArray, addedValues) {
              coreArray[index] = addedValues[0];
              return true;
            },
          },
          proxyContext
        );
      }
      return Reflect.set(target[1], key, ...rest);
    },
    deleteProperty(target, key) {
      const { dataset } = proxyContext;
      if (typeof key !== "symbol" && !isNaN(parseInt(key as string))) {
        const objectQuad = dataset.match(...target[0]).toArray()[parseInt(key)];
        if (!objectQuad) {
          return true;
        }
        const term = target[2] ? objectQuad.subject : objectQuad.object;
        if (term.termType === "Literal") {
          const subject = target[0][0] as NamedNode;
          const predicate = target[0][1] as NamedNode;
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
