import { ArrayProxyTarget } from "./createArrayHandler";
import { ObjectJsonRepresentation } from "../util/objectToJsonRepresentation";
import { ProxyContext } from "../types";
import { modifyArray } from "./modifyArray";

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

export const arrayMethodsBuilders: ArrayMethodBuildersType = {
  copyWithin: (target, proxyContext) => {
    return (targetIndex, start, end) => {
      return modifyArray(
        {
          target,
          quadsToDelete: (quads) => {
            const realEnd = end || quads.length - 1;
            return quads.slice(targetIndex, targetIndex + (realEnd - start));
          },
          modifyCoreArray: (coreArray) => {
            coreArray.copyWithin(targetIndex, start, end);
            return proxyContext.proxyCreator.createArrayProxy(
              target[0],
              proxyContext,
              target[2]
            ) as ObjectJsonRepresentation[];
          },
        },
        proxyContext
      );
    };
  },
  fill: (target, proxyContext) => {
    return (value, start, end) => {
      return modifyArray(
        {
          target,
          toAdd: [value],
          quadsToDelete: (quads) => {
            return quads.slice(start, end);
          },
          modifyCoreArray: (coreArray, addedValues = []) => {
            coreArray.fill(addedValues[0], start, end);
            return proxyContext.proxyCreator.createArrayProxy(
              target[0],
              proxyContext,
              target[2]
            ) as ObjectJsonRepresentation[];
          },
        },
        proxyContext
      );
    };
  },
  pop: (target, proxyContext) => {
    return () => {
      return modifyArray(
        {
          target,
          quadsToDelete: (quads) => {
            return quads[quads.length - 1] ? [quads[quads.length - 1]] : [];
          },
          modifyCoreArray: (coreArray) => {
            return coreArray.pop();
          },
        },
        proxyContext
      );
    };
  },
  push: (target, proxyContext) => {
    return (...args) => {
      return modifyArray(
        {
          target,
          toAdd: args,
          modifyCoreArray: (coreArray, addedValues = []) => {
            coreArray.push(...addedValues);
            return proxyContext.proxyCreator.createArrayProxy(
              target[0],
              proxyContext,
              target[2]
            ).length;
          },
        },
        proxyContext
      );
    };
  },
  reverse: (target) => {
    return () => {
      return target[1].reverse();
    };
  },
  shift: (target, proxyContext) => {
    return () => {
      return modifyArray(
        {
          target,
          quadsToDelete: (quads) => {
            return quads[0] ? [quads[0]] : [];
          },
          modifyCoreArray: (coreArray) => {
            return coreArray.shift();
          },
        },
        proxyContext
      );
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
    };
  },
  unshift: (target, proxyContext) => {
    return (...args) => {
      return modifyArray(
        {
          target,
          toAdd: args,
          modifyCoreArray: (coreArray, addedValues = []) => {
            coreArray.unshift(...addedValues);
            return proxyContext.proxyCreator.createArrayProxy(
              target[0],
              proxyContext,
              target[2]
            ).length;
          },
        },
        proxyContext
      );
    };
  },
};
