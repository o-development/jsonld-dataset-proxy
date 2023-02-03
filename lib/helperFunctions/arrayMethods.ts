import { ProxyTransactionalDataset } from "o-dataset-pack";
import { createExtendedDatasetFactory } from "o-dataset-pack/dist/createExtendedDataset";
import { BlankNode, DefaultGraph, Literal, NamedNode } from "@rdfjs/types";
import { ArrayProxyTarget } from "../createArrayHandler";
import { ProxyContext } from "../ProxyContext";
import {
  AddObjectItem,
  addObjectToDataset,
  AddObjectValue,
  getIdNode,
} from "./addObjectToDataset";
import { ObjectJsonRepresentation } from "./objectToJsonRepresentation";

export type methodBuilder<Return> = (
  target: ArrayProxyTarget,
  proxyContext: ProxyContext
) => Return;

export interface ArrayMethodBuildersType {
  copyWithin: methodBuilder<Array<ObjectJsonRepresentation>["copyWithin"]>;
  fill: methodBuilder<Array<ObjectJsonRepresentation>["fill"]>;
  pop: methodBuilder<Array<ObjectJsonRepresentation>["pop"]>;
  push: methodBuilder<Array<ObjectJsonRepresentation>["push"]>;
  reverse: methodBuilder<Array<ObjectJsonRepresentation>["reverse"]>;
  shift: methodBuilder<Array<ObjectJsonRepresentation>["shift"]>;
  sort: methodBuilder<Array<ObjectJsonRepresentation>["sort"]>;
  splice: methodBuilder<Array<ObjectJsonRepresentation>["splice"]>;
  unshift: methodBuilder<Array<ObjectJsonRepresentation>["unshift"]>;
}

export const methodNames: Set<keyof ArrayMethodBuildersType> = new Set([
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift",
]);

export function nodeToString(
  node: NamedNode | BlankNode | DefaultGraph | Literal | null | undefined
): string {
  if (node == null) {
    return "null";
  }
  switch (node.termType) {
    case "NamedNode":
      return `namedNode("${node.value}")`;
    case "BlankNode":
      return `blankNode("${node.value}")`;
    case "Literal":
      return `literal(${JSON.stringify(node.value)})`;
    case "DefaultGraph":
      return "defaultGraph()";
  }
}

export function checkArrayModification(
  target: ArrayProxyTarget,
  objectsToAdd: ObjectJsonRepresentation[],
  proxyContext: ProxyContext
) {
  if (target[2]) {
    for (const objectToAdd of objectsToAdd) {
      if (typeof objectToAdd !== "object") {
        throw new Error(
          `Cannot add a literal "${objectToAdd}"(${typeof objectToAdd}) to a subject-oriented collection.`
        );
      }
      // Create a test dataset to see if the inputted data is valid
      const testDataset = new ProxyTransactionalDataset(
        proxyContext.dataset,
        createExtendedDatasetFactory()
      );
      addObjectToDataset(objectToAdd as AddObjectItem, new Set(), false, {
        contextUtil: proxyContext.contextUtil,
        dataset: testDataset,
        proxyCreator: proxyContext.proxyCreator,
      });
      const isValidAddition =
        testDataset.match(
          getIdNode(objectToAdd as AddObjectItem, proxyContext.contextUtil),
          target[0][1],
          target[0][2]
        ).size !== 0;
      if (!isValidAddition) {
        throw new Error(
          `Cannot add value to collection. This must contain a quad that matches (${nodeToString(
            target[0][0]
          )}, ${nodeToString(target[0][1])}, ${nodeToString(
            target[0][2]
          )}, ${nodeToString(target[0][3])})`
        );
      }
    }
  } else if (!target[0][0] || !target[0][1]) {
    throw new Error(
      "A collection that does not specify a match for both a subject or predicate cannot be modified directly."
    );
  }
}

export function replaceArray(
  target: ArrayProxyTarget,
  replacement: AddObjectValue[],
  proxyContext: ProxyContext
) {
  if (target[2]) {
    replacement.forEach((item) => {
      addObjectToDataset(item as AddObjectItem, new Set(), true, proxyContext);
    });
  } else if (target[0][0] && target[0][1]) {
    const itemToAdd = {
      "@id": target[0][0],
      [proxyContext.contextUtil.iriToKey(target[0][1].value)]: replacement,
    } as AddObjectItem;
    addObjectToDataset(itemToAdd, new Set(), true, proxyContext);
  }
}

export const arrayMethodsBuilders: ArrayMethodBuildersType = {
  copyWithin: (target, proxyContext) => {
    return (...args) => {
      const toReturn = target[1].copyWithin(...args);
      replaceArray(target, target[1] as AddObjectValue[], proxyContext);
      return toReturn;
    };
  },
  fill: (target, proxyContext) => {
    return (...args) => {
      checkArrayModification(target, [args[0]], proxyContext);
      const toReturn = target[1].fill(...args);
      replaceArray(target, target[1] as AddObjectValue[], proxyContext);
      return toReturn;
    };
  },
  pop: (target, proxyContext) => {
    return (...args) => {
      const toReturn = target[1].pop(...args);
      replaceArray(target, target[1] as AddObjectValue[], proxyContext);
      return toReturn;
    };
  },
  // TODO: Push is an O(n) operation. It could be made O(1), but I
  // was lazy. I'll come back to fix this.
  push: (target, proxyContext) => {
    return (...args) => {
      checkArrayModification(target, args, proxyContext);
      const toReturn = target[1].push(...args);
      replaceArray(target, target[1] as AddObjectValue[], proxyContext);
      return toReturn;
    };
  },
  reverse: (target) => {
    return () => {
      return target[1].reverse();
    };
  },
  shift: (target, proxyContext) => {
    return (...args) => {
      const toReturn = target[1].shift(...args);
      replaceArray(target, target[1] as AddObjectValue[], proxyContext);
      return toReturn;
    };
  },
  sort: (target) => {
    return (...args) => {
      return target[1].sort(...args);
    };
  },
  splice: (target, proxyContext) => {
    return (start, deleteCount, ...items: ObjectJsonRepresentation[]) => {
      checkArrayModification(target, items, proxyContext);
      const toReturn =
        items.length > 0
          ? target[1].splice(start, deleteCount as number, ...items)
          : target[1].splice(start, deleteCount);
      replaceArray(target, target[1] as AddObjectValue[], proxyContext);
      return toReturn;
    };
  },
  unshift: (target, proxyContext) => {
    return (...args) => {
      checkArrayModification(target, args, proxyContext);
      const toReturn = target[1].unshift(...args);
      replaceArray(target, target[1] as AddObjectValue[], proxyContext);
      return toReturn;
    };
  },
};
