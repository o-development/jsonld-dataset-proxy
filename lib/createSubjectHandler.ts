import { BlankNode, NamedNode } from "@rdfjs/types";
import { namedNode, quad } from "@rdfjs/data-model";
import { addObjectToDataset } from "./helperFunctions/addObjectToDataset";
import { getProxyFromDataset } from "./helperFunctions/getProxyFromDataset";
import { deleteValueFromDataset } from "./helperFunctions/deleteFromDataset";
import { ProxyContext } from "./ProxyContext";
import {
  _getUnderlyingContext,
  _getUnderlyingDataset,
  _getUnderlyingNode,
} from "./JsonldDatasetProxyType";

export interface ObjectWithId {
  "@id": NamedNode | BlankNode;
}

export function createSubjectHander(
  proxyContext: ProxyContext
): ProxyHandler<ObjectWithId> {
  return {
    get(target: ObjectWithId, key: string | symbol) {
      switch (key) {
        case _getUnderlyingDataset:
          return proxyContext.dataset;
        case _getUnderlyingNode:
          return target["@id"];
        case _getUnderlyingContext:
          return proxyContext.contextUtil.context;
      }
      return getProxyFromDataset(target, key, proxyContext);
    },
    getOwnPropertyDescriptor(target: ObjectWithId, key: string) {
      return {
        value: getProxyFromDataset(target, key, proxyContext),
        writable: true,
        enumerable: true,
        configurable: true,
      };
    },
    ownKeys(target) {
      const subject = target["@id"];
      const tripleDataset = proxyContext.dataset.match(subject);
      const keys: Set<string> = new Set(["@id"]);
      tripleDataset.toArray().forEach((quad) => {
        keys.add(proxyContext.contextUtil.iriToKey(quad.predicate.value));
      });
      return Array.from(keys);
    },
    set: (target: ObjectWithId, key: string, value) => {
      if (key === "@id" && typeof value === "string") {
        const currentSubjectQuads = proxyContext.dataset
          .match(target["@id"])
          .toArray();
        const newSubjectQuads = currentSubjectQuads.map((curQuad) =>
          quad(
            namedNode(value),
            curQuad.predicate,
            curQuad.object,
            curQuad.graph
          )
        );
        currentSubjectQuads.forEach((curQuad) =>
          proxyContext.dataset.delete(curQuad)
        );
        proxyContext.dataset.addAll(newSubjectQuads);
        const currentObjectQuads = proxyContext.dataset
          .match(undefined, undefined, target["@id"])
          .toArray();
        const newObjectQuads = currentObjectQuads.map((curQuad) =>
          quad(
            curQuad.subject,
            curQuad.predicate,
            namedNode(value),
            curQuad.graph
          )
        );
        currentObjectQuads.forEach((curQuad) =>
          proxyContext.dataset.delete(curQuad)
        );
        proxyContext.dataset.addAll(newObjectQuads);
        target["@id"] = namedNode(value);
      }
      addObjectToDataset(
        { "@id": target["@id"], [key]: value },
        new Set(),
        true,
        proxyContext
      );
      return true;
    },
    deleteProperty(target, key) {
      return deleteValueFromDataset(target, key, proxyContext);
    },
  };
}
