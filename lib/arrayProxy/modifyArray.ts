import { defaultGraph } from "@rdfjs/data-model";
import {
  BlankNode,
  DefaultGraph,
  Literal,
  NamedNode,
  Quad,
} from "@rdfjs/types";
import { ProxyTransactionalDataset } from "o-dataset-pack";
import { createExtendedDatasetFactory } from "o-dataset-pack/dist/createExtendedDataset";
import { ProxyContext } from "../types";
import { addObjectToDataset } from "../util/addObjectToDataset";
import { getNodeFromRawObject } from "../util/getNodeFromRaw";
import { ObjectJsonRepresentation } from "../util/objectToJsonRepresentation";
import { RawObject, RawValue } from "../util/RawObject";
import { ArrayProxyTarget } from "./createArrayHandler";

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
      return `literal(${node.value}, ${node.datatype.value})`;
    case "DefaultGraph":
      return "defaultGraph()";
  }
}

export function checkArrayModification(
  target: ArrayProxyTarget,
  objectsToAdd: RawValue[],
  proxyContext: ProxyContext
) {
  if (target[2]) {
    for (const objectToAdd of objectsToAdd) {
      // Undefined is fine no matter what
      if (objectToAdd === undefined) {
        return;
      }
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
      addObjectToDataset(objectToAdd as RawObject, false, {
        contextUtil: proxyContext.contextUtil,
        dataset: testDataset,
        proxyCreator: proxyContext.proxyCreator,
        readGraphs: [],
        writeGraphs: [defaultGraph()],
      });
      const isValidAddition =
        testDataset.match(
          getNodeFromRawObject(objectToAdd, proxyContext.contextUtil),
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
    toAdd?: RawValue[];
    quadsToDelete?: (quads: Quad[]) => Quad[];
    modifyCoreArray: (
      coreArray: ArrayProxyTarget[1],
      addedValues: ObjectJsonRepresentation[]
    ) => ReturnType;
  },
  proxyContext: ProxyContext
): ReturnType {
  const { target, toAdd, quadsToDelete, modifyCoreArray } = config;
  const { dataset, contextUtil } = proxyContext;
  checkArrayModification(target, toAdd || [], proxyContext);

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

  // Add new items to the dataset
  const added = toAdd
    ?.map((item) => {
      return typeof item === "object"
        ? addObjectToDataset(item, false, proxyContext)
        : item;
    })
    .filter(
      (val) => val !== undefined
    ) as NonNullable<ObjectJsonRepresentation>[];
  if (!target[2] && target[0][0] && target[0][1] && added) {
    addObjectToDataset(
      {
        "@id": target[0][0],
        [contextUtil.iriToKey(target[0][1].value)]: added,
      } as RawObject,
      false,
      proxyContext
    );
  }

  // Allow the base array to be modified
  return modifyCoreArray(target[1], added);
}
