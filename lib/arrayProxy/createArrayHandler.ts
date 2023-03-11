import { NamedNode } from "@rdfjs/types";
import {
  ObjectJsonRepresentation,
  nodeToJsonldRepresentation,
} from "../util/nodeToJsonldRepresentation";
import { quad } from "@rdfjs/data-model";
import {
  ArrayMethodBuildersType,
  arrayMethodsBuilders,
  methodNames,
} from "./arrayMethods";
import {
  ObjectType,
  QuadMatch,
  SubjectType,
  _getNodeAtIndex,
  _getUnderlyingArrayTarget,
  _getUnderlyingDataset,
  _getUnderlyingMatch,
  _isSubjectOriented,
  _proxyContext,
} from "../types";
import { modifyArray } from "./modifyArray";
import { ProxyContext } from "../ProxyContext";
import { NodeSet } from "../util/NodeSet";

export type ArrayProxyTarget = [
  quadMatch: QuadMatch,
  curArray: ObjectType[],
  isSubjectOriented?: boolean
];

function updateArrayOrder(
  target: ArrayProxyTarget,
  proxyContext: ProxyContext
): void {
  const quads = proxyContext.dataset.match(...target[0]);
  const datasetObjects = new NodeSet();
  quads.toArray().forEach((quad) => {
    // If this this a subject-oriented document
    if (target[2]) {
      datasetObjects.add(quad.subject as SubjectType);
    } else {
      datasetObjects.add(quad.object as ObjectType);
    }
  });
  const processedObjects: ObjectType[] = [];
  target[1].forEach((arrItem) => {
    if (datasetObjects.has(arrItem)) {
      processedObjects.push(arrItem);
      datasetObjects.delete(arrItem);
    }
  });
  datasetObjects.toArray().forEach((datasetObject) => {
    processedObjects.push(datasetObject);
  });
  target[1] = processedObjects;
}

function getProcessedArray(
  target: ArrayProxyTarget,
  proxyContext: ProxyContext
): ObjectJsonRepresentation[] {
  return target[1].map((node) => {
    return nodeToJsonldRepresentation(node, proxyContext);
  });
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
        case _getUnderlyingArrayTarget:
          return target;
        case _proxyContext:
          return proxyContext;
        case _getNodeAtIndex:
          return (index: number): ObjectType | undefined => {
            updateArrayOrder(target, proxyContext);
            return target[1][index];
          };
      }

      // TODO: Because of this, every get operation is O(n). Consider changing
      // this
      updateArrayOrder(target, proxyContext);
      const processedArray = getProcessedArray(target, proxyContext);
      if (methodNames.has(key as keyof ArrayMethodBuildersType)) {
        return arrayMethodsBuilders[key as keyof ArrayMethodBuildersType](
          target,
          key as string,
          proxyContext
        );
      }
      return Reflect.get(processedArray, key, ...rest);
    },
    getOwnPropertyDescriptor(target, key, ...rest) {
      updateArrayOrder(target, proxyContext);
      const processedArray = getProcessedArray(target, proxyContext);
      return Reflect.getOwnPropertyDescriptor(processedArray, key, ...rest);
    },
    ownKeys(target, ...rest) {
      updateArrayOrder(target, proxyContext);
      const processedArray = getProcessedArray(target, proxyContext);
      return Reflect.ownKeys(processedArray, ...rest);
    },
    getPrototypeOf(target, ...rest) {
      updateArrayOrder(target, proxyContext);
      const processedObjects = getProcessedArray(target, proxyContext);
      return Reflect.getPrototypeOf(processedObjects, ...rest);
    },
    has(target, ...rest) {
      updateArrayOrder(target, proxyContext);
      const processedObjects = getProcessedArray(target, proxyContext);
      return Reflect.has(processedObjects, ...rest);
    },
    set(target, key, value, ...rest) {
      if (key === _proxyContext) {
        proxyContext = value;
        return true;
      }
      updateArrayOrder(target, proxyContext);
      if (typeof key !== "symbol" && !isNaN(parseInt(key as string))) {
        const index = parseInt(key);
        return modifyArray(
          {
            target,
            key,
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
