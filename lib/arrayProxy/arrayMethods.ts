import { ArrayProxyTarget } from "./createArrayHandler";
import { addObjectToDataset } from "../util/addObjectToDataset";
import { ObjectJsonRepresentation } from "../util/objectToJsonRepresentation";
import { ProxyContext } from "../types";
import { RawObject, RawValue } from "../util/RawObject";
import { checkArrayModification, modifyArray } from "./modifyArray";

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

export function replaceArray(
  target: ArrayProxyTarget,
  replacement: RawValue[],
  proxyContext: ProxyContext
) {
  if (target[2]) {
    replacement.forEach((item) => {
      addObjectToDataset(item as RawObject, true, proxyContext);
    });
  } else if (target[0][0] && target[0][1]) {
    const itemToAdd = {
      "@id": target[0][0],
      [proxyContext.contextUtil.iriToKey(target[0][1].value)]: replacement,
    };
    addObjectToDataset(itemToAdd as RawObject, true, proxyContext);
  }
}

export const arrayMethodsBuilders: ArrayMethodBuildersType = {
  copyWithin: (target, proxyContext) => {
    return (...args) => {
      const toReturn = target[1].copyWithin(...args);
      replaceArray(target, target[1], proxyContext);
      return toReturn;
    };
  },
  fill: (target, proxyContext) => {
    return (...args) => {
      checkArrayModification(target, [args[0]], proxyContext);
      const toReturn = target[1].fill(...args);
      replaceArray(target, target[1], proxyContext);
      return toReturn;
    };
  },
  pop: (target, proxyContext) => {
    return (...args) => {
      const toReturn = target[1].pop(...args);
      replaceArray(target, target[1], proxyContext);
      return toReturn;
    };
  },
  // TODO: Push is an O(n) operation. It could be made O(1), but I
  // was lazy. I'll come back to fix this.
  push: (target, proxyContext) => {
    return (...args) => {
      checkArrayModification(target, args, proxyContext);
      const toReturn = target[1].push(...args);
      replaceArray(target, target[1], proxyContext);
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
      replaceArray(target, target[1], proxyContext);
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
      return modifyArray(
        {
          target,
          toAdd: items,
          quadsToDelete: (quads) => {
            return quads.splice(start, deleteCount);
          },
          modifyCoreArray: (coreArray, addedValues = []) => {
            return coreArray.splice(start, deleteCount || 0, ...addedValues);
          },
        },
        proxyContext
      );

      // checkArrayModification(target, items, proxyContext);
      // const toReturn =
      //   items.length > 0
      //     ? target[1].splice(start, deleteCount as number, ...items)
      //     : target[1].splice(start, deleteCount);
      // replaceArray(target, target[1], proxyContext);
      // return toReturn;
    };
  },
  unshift: (target, proxyContext) => {
    return (...args) => {
      checkArrayModification(target, args, proxyContext);
      const toReturn = target[1].unshift(...args);
      replaceArray(target, target[1], proxyContext);
      return toReturn;
    };
  },
};
