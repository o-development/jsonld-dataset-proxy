import { Dataset } from "@rdfjs/types";
import { ContextUtil } from "../ContextUtil";
import { ArrayProxyTarget } from "../createArrayHandler";
import { addObjectToDataset } from "./addObjectToDataset";
import { ObjectJsonRepresentation } from "./objectToJsonRepresentation";

export type methodBuilder<Return> = (
  target: ArrayProxyTarget,
  dataset: Dataset,
  contextUtil: ContextUtil
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

export function replaceArray(
  target: ArrayProxyTarget,
  replacement: unknown[],
  dataset: Dataset,
  contextUtil: ContextUtil
) {
  if (target[0][0] && target[0][1]) {
    addObjectToDataset(
      {
        "@id": target[0][0].value,
        [contextUtil.iriToKey(target[0][1].value)]: replacement,
      },
      dataset,
      contextUtil,
      new Set(),
      true
    );
  }
}

export const arrayMethodsBuilders: ArrayMethodBuildersType = {
  copyWithin: (target, dataset, contextUtil) => {
    return (...args) => {
      const toReturn = target[1].copyWithin(...args);
      replaceArray(target, target[1], dataset, contextUtil);
      return toReturn;
    };
  },
  fill: (target, dataset, contextUtil) => {
    return (...args) => {
      const toReturn = target[1].fill(...args);
      replaceArray(target, target[1], dataset, contextUtil);
      return toReturn;
    };
  },
  pop: (target, dataset, contextUtil) => {
    return (...args) => {
      const toReturn = target[1].pop(...args);
      replaceArray(target, target[1], dataset, contextUtil);
      return toReturn;
    };
  },
  push: (target, dataset, contextUtil) => {
    return (...args) => {
      const toReturn = target[1].push(...args);
      replaceArray(target, target[1], dataset, contextUtil);
      return toReturn;
    };
  },
  reverse: (target) => {
    return () => {
      return target[1].reverse();
    };
  },
  shift: (target, dataset, contextUtil) => {
    return (...args) => {
      const toReturn = target[1].shift(...args);
      replaceArray(target, target[1], dataset, contextUtil);
      return toReturn;
    };
  },
  sort: (target) => {
    return (...args) => {
      return target[1].sort(...args);
    };
  },
  splice: (target, dataset, contextUtil) => {
    return (start, deleteCount, ...items: ObjectJsonRepresentation[]) => {
      const toReturn =
        items.length > 0
          ? target[1].splice(start, deleteCount as number, ...items)
          : target[1].splice(start, deleteCount);
      replaceArray(target, target[1], dataset, contextUtil);
      return toReturn;
    };
  },
  unshift: (target, dataset, contextUtil) => {
    return (...args) => {
      const toReturn = target[1].unshift(...args);
      replaceArray(target, target[1], dataset, contextUtil);
      return toReturn;
    };
  },
};
