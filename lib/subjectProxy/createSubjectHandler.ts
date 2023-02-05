import { BlankNode, NamedNode } from "@rdfjs/types";
import { namedNode, quad } from "@rdfjs/data-model";
import { addObjectToDataset } from "../util/addObjectToDataset";
import { deleteValueFromDataset } from "./deleteFromDataset";
import {
  ProxyContext,
  _getUnderlyingDataset,
  _getUnderlyingNode,
} from "../types";
import { getValueForKey } from "./getValueForKey";

export interface SubjectProxyTarget {
  "@id": NamedNode | BlankNode;
}

export function createSubjectHander(
  proxyContext: ProxyContext
): ProxyHandler<SubjectProxyTarget> {
  return {
    get(target: SubjectProxyTarget, key: string | symbol) {
      switch (key) {
        case _getUnderlyingDataset:
          return proxyContext.dataset;
        case _getUnderlyingNode:
          return target["@id"];
        case "@context":
          return proxyContext.contextUtil.context;
      }
      return getValueForKey(target, key, proxyContext);
    },
    getOwnPropertyDescriptor(target: SubjectProxyTarget, key: string) {
      return {
        value: getValueForKey(target, key, proxyContext),
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
    set: (target: SubjectProxyTarget, key: string, value) => {
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