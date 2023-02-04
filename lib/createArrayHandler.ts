import { BlankNode, NamedNode } from "@rdfjs/types";
import {
  AddObjectItem,
  addObjectToDataset,
  AddObjectValue,
} from "./helperFunctions/addObjectToDataset";
import {
  ObjectJsonRepresentation,
  objectToJsonldRepresentation,
} from "./helperFunctions/objectToJsonRepresentation";
import { quad } from "@rdfjs/data-model";
import {
  ArrayMethodBuildersType,
  arrayMethodsBuilders,
  checkArrayModification,
  methodNames,
  replaceArray,
} from "./helperFunctions/arrayMethods";
import { ProxyContext } from "./ProxyContext";
import {
  _getUnderlyingContext,
  _getUnderlyingDataset,
  _getUnderlyingMatch,
} from "./JsonldDatasetProxyType";
import { QuadMatch } from "./QuadMatch";

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
        case _getUnderlyingContext:
          return proxyContext.contextUtil.context;
      }

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
      getProcessedObjects(target, proxyContext);
      if (typeof key !== "symbol" && !isNaN(parseInt(key as string))) {
        const index = parseInt(key);
        checkArrayModification(target, [value], proxyContext);
        // If it is subject-oriented
        if (target[2]) {
          const curSubject = dataset.match(...target[0]).toArray()[
            index
          ].subject;
          dataset.deleteMatches(curSubject, undefined, undefined);
          const object = addObjectToDataset(
            value,
            new Set(),
            false,
            proxyContext
          );
          target[1][index] = object;
          return true;
        } else if (target[0][0] && target[0][1]) {
          const curQuad = dataset.match(...target[0]).toArray()[index];
          if (curQuad) {
            dataset.delete(curQuad);
          }
          const addedObject =
            typeof value === "object"
              ? addObjectToDataset(value, new Set(), false, proxyContext)
              : value;
          addObjectToDataset(
            {
              "@id": target[0][0],
              [contextUtil.iriToKey(target[0][1].value)]: addedObject,
            },
            new Set(),
            false,
            proxyContext
          );
          target[1][index] = addedObject;
          return true;
        }
        return false;
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
        const term = objectQuad.object;
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
