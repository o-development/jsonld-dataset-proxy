import { ProxyTransactionalDataset } from "o-dataset-pack";
import { createExtendedDatasetFactory } from "o-dataset-pack/dist/createExtendedDataset";
import {
  BlankNode,
  DefaultGraph,
  Literal,
  NamedNode,
  Quad,
} from "@rdfjs/types";
import { ArrayProxyTarget } from "./createArrayHandler";
import {
  AddObjectItem,
  addObjectToDataset,
  AddObjectValue,
  getIdNode,
} from "../util/addObjectToDataset";
import { ObjectJsonRepresentation } from "../util/objectToJsonRepresentation";
import { ProxyContext } from "../types";

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
  objectsToAdd: AddObjectValue[],
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
      addObjectToDataset(objectToAdd as AddObjectItem, false, {
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

export function modifyArray<ReturnType>(
  config: {
    target: ArrayProxyTarget;
    toAdd?: AddObjectValue[];
    quadsToDelete?: (quads: Quad[]) => Quad[];
    modifyCoreArray: (
      coreArray: ArrayProxyTarget[1],
      addedValues?: ObjectJsonRepresentation[]
    ) => ReturnType;
  },
  proxyContext: ProxyContext
): ReturnType {
  const { target, toAdd, quadsToDelete, modifyCoreArray } = config;
  const { dataset, contextUtil } = proxyContext;
  checkArrayModification(target, toAdd || [], proxyContext);

  // Find subjects already in the array
  // const subjectsAlreadyInTheArray = new Set<NamedNode | BlankNode>();
  // toAdd?.forEach((item) => {
  //   if () {

  //   }
  //   const subject = getIdNode(item, proxyContext.contextUtil);

  // });

  // Add new items to the dataset
  const added = toAdd?.map((item) => {
    return typeof item === "object"
      ? addObjectToDataset(item as AddObjectItem, false, proxyContext)
      : item;
  }); // Filter items that were duplicates
  if (!target[2] && target[0][0] && target[0][1] && added) {
    addObjectToDataset(
      {
        "@id": target[0][0],
        [contextUtil.iriToKey(target[0][1].value)]: added,
      } as AddObjectItem,
      false,
      proxyContext
    );
  }
  // Remove appropriate Quads
  if (quadsToDelete) {
    const quadArr = dataset.match(...target[0]).toArray();
    const deleteQuadArr = quadsToDelete(quadArr);
    // Filter out overlapping items
    deleteQuadArr.forEach((delQuad) => {
      if (target[2]) {
        dataset.deleteMatches(delQuad.subject, undefined, undefined);
      } else {
        dataset.delete(delQuad);
      }
    });
  }
  // Allow the base array to be modified
  return modifyCoreArray(target[1], added);
}

export function replaceArray(
  target: ArrayProxyTarget,
  replacement: AddObjectValue[],
  proxyContext: ProxyContext
) {
  if (target[2]) {
    replacement.forEach((item) => {
      addObjectToDataset(item as AddObjectItem, true, proxyContext);
    });
  } else if (target[0][0] && target[0][1]) {
    const itemToAdd = {
      "@id": target[0][0],
      [proxyContext.contextUtil.iriToKey(target[0][1].value)]: replacement,
    } as AddObjectItem;
    addObjectToDataset(itemToAdd, true, proxyContext);
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
      checkArrayModification(target, [args[0] as AddObjectValue], proxyContext);
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
      checkArrayModification(target, args as AddObjectValue[], proxyContext);
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
      checkArrayModification(target, items as AddObjectValue[], proxyContext);
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
      checkArrayModification(target, args as AddObjectValue[], proxyContext);
      const toReturn = target[1].unshift(...args);
      replaceArray(target, target[1] as AddObjectValue[], proxyContext);
      return toReturn;
    };
  },
};
