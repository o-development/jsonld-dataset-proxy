import { Dataset } from "@rdfjs/types";
import { namedNode } from "@rdfjs/dataset";
import { ContextUtil } from "./ContextUtil";
import { ProxyCreator } from "./ProxyCreator";
import { addObjectToDataset } from "./helperFunctions/addObjectToDataset";
import { getProxyFromDataset } from "./helperFunctions/getProxyFromDataset";
import { deleteValueFromDataset } from "./helperFunctions/deleteFromDataset";

export interface ObjectWithId {
  "@id": string;
}

export function createSubjectHander(
  dataset: Dataset,
  contextUtil: ContextUtil,
  proxyCreator: ProxyCreator
): ProxyHandler<ObjectWithId> {
  return {
    get(target: ObjectWithId, key: string) {
      return getProxyFromDataset(
        target,
        key,
        dataset,
        contextUtil,
        proxyCreator
      );
    },
    getOwnPropertyDescriptor(target: ObjectWithId, key: string) {
      const thing = {
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
      return thing;
    },
    ownKeys(target) {
      const subject = namedNode(target["@id"]);
      const tripleDataset = dataset.match(subject);
      const keys: Set<string> = new Set(["@id"]);
      tripleDataset.toArray().forEach((quad) => {
        keys.add(contextUtil.iriToKey(quad.predicate.value));
      });
      return Array.from(keys);
    },
    set: (target: ObjectWithId, key: string, value) => {
      addObjectToDataset(
        { "@id": target["@id"], [key]: value },
        dataset,
        contextUtil,
        new Set()
      );
      return true;
    },
    deleteProperty(target, key) {
      return deleteValueFromDataset(target, key, dataset, contextUtil);
    },
  };
}
