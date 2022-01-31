import { BlankNode, Dataset, NamedNode } from "@rdfjs/types";
import { namedNode, quad } from "@rdfjs/dataset";
import { ContextUtil } from "./ContextUtil";
import { ProxyCreator } from "./ProxyCreator";
import { addObjectToDataset } from "./helperFunctions/addObjectToDataset";
import { getProxyFromDataset } from "./helperFunctions/getProxyFromDataset";
import { deleteValueFromDataset } from "./helperFunctions/deleteFromDataset";

export interface ObjectWithId {
  "@id": NamedNode | BlankNode;
}

export const getUnderlyingNode = Symbol("getUnderlyingNode");

export function createSubjectHander(
  dataset: Dataset,
  contextUtil: ContextUtil,
  proxyCreator: ProxyCreator
): ProxyHandler<ObjectWithId> {
  return {
    get(target: ObjectWithId, key: string | symbol) {
      if (key === getUnderlyingNode) {
        return target["@id"];
      }
      return getProxyFromDataset(
        target,
        key,
        dataset,
        contextUtil,
        proxyCreator
      );
    },
    getOwnPropertyDescriptor(target: ObjectWithId, key: string) {
      return {
        value: getProxyFromDataset(
          target,
          key,
          dataset,
          contextUtil,
          proxyCreator
        ),
        writable: true,
        enumerable: true,
        configurable: true,
      };
    },
    ownKeys(target) {
      const subject = target["@id"];
      const tripleDataset = dataset.match(subject);
      const keys: Set<string> = new Set(["@id"]);
      tripleDataset.toArray().forEach((quad) => {
        keys.add(contextUtil.iriToKey(quad.predicate.value));
      });
      return Array.from(keys);
    },
    set: (target: ObjectWithId, key: string, value) => {
      if (key === "@id" && typeof value === "string") {
        const currentSubjectQuads = dataset.match(target["@id"]).toArray();
        const newSubjectQuads = currentSubjectQuads.map((curQuad) =>
          quad(
            namedNode(value),
            curQuad.predicate,
            curQuad.object,
            curQuad.graph
          )
        );
        currentSubjectQuads.forEach((curQuad) => dataset.delete(curQuad));
        dataset.addAll(newSubjectQuads);
        const currentObjectQuads = dataset
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
        currentObjectQuads.forEach((curQuad) => dataset.delete(curQuad));
        dataset.addAll(newObjectQuads);
      }
      addObjectToDataset(
        { "@id": target["@id"], [key]: value },
        dataset,
        contextUtil,
        new Set(),
        true
      );
      return true;
    },
    deleteProperty(target, key) {
      return deleteValueFromDataset(target, key, dataset, contextUtil);
    },
  };
}
