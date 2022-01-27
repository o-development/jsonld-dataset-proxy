import { Dataset } from "@rdfjs/types";
import { namedNode } from "@rdfjs/dataset";
import { objectToJsonldRepresentation } from "./objectToJsonRepresentation";
import { ContextUtil } from "./ContextUtil";
import { ProxyCreator } from "./ProxyCreator";

export interface ObjectWithId {
  "@id": string;
}

// function addObjectValueToDataset(
//   dataset: Dataset,
//   context: ContextDefinition,
//   key: string,
//   visitedObjects: Set<object>,
//   subject: NamedNode,
//   predicate: NamedNode,
//   value: unknown
// ): void {
//   let object: NamedNode | Literal;
//   if (typeof value === "string") {
//     const datatype = getContextType(context, key);
//     if (datatype === "@id") {
//       object = namedNode(value);
//     } else {
//       object = literal(value, datatype);
//     }
//     dataset.add(quad(subject, predicate, object));
//   } else if (
//     value &&
//     typeof value === "object" &&
//     (value as ObjectWithId)["@id"]
//   ) {
//     object = namedNode((value as ObjectWithId)["@id"]);
//     dataset.add(quad(subject, predicate, object));
//     addObjectToDataset(value as ObjectWithId, dataset, context, visitedObjects);
//   } else {
//     throw Error("Set object does not have an @id");
//   }
// }

// function addObjectToDataset(
//   item: ObjectWithId,
//   dataset: Dataset,
//   context: ContextDefinition,
//   visitedObjects: Set<object>
// ): void {
//   if (visitedObjects.has(item)) {
//     return;
//   }
//   visitedObjects.add(item);
//   const subject = namedNode(item["@id"]);
//   Object.entries(item).forEach(([key, value]) => {
//     if (key === "@id") {
//       return;
//     }
//     const predicate = namedNode(getContextIri(context, key));
//     dataset.deleteMatches(subject, predicate);
//     if (Array.isArray(value)) {
//       value.forEach((valueItem) => {
//         addObjectValueToDataset(
//           dataset,
//           context,
//           key,
//           visitedObjects,
//           subject,
//           predicate,
//           valueItem
//         );
//       });
//     } else {
//       addObjectValueToDataset(
//         dataset,
//         context,
//         key,
//         visitedObjects,
//         subject,
//         predicate,
//         value
//       );
//     }
//   });
// }

function getValue(
  target: ObjectWithId,
  key: string | symbol,
  dataset: Dataset,
  contextUtil: ContextUtil,
  proxyCreator: ProxyCreator
) {
  if (key === "@id") {
    return target["@id"];
  }
  if (key === "toString" || key === Symbol.toStringTag) {
    // TODO: this toString method right now returns [object Object],
    // which is correct, but it could be more descriptive, especially
    // because console.log doesn't return anyting helpful due to the proxy.
    return Reflect.get(target, "toString");
  }
  if (typeof key === "symbol") {
    return;
  }
  const subject = namedNode(target["@id"]);
  const predicate = namedNode(contextUtil.keyToIri(key));
  if (contextUtil.isArray(key)) {
    const arrayProxy = proxyCreator.createArrayProxy(
      [subject, predicate],
      dataset,
      contextUtil
    );
    return arrayProxy;
  }
  const objectDataset = dataset.match(subject, predicate);
  if (objectDataset.size === 0) {
    return undefined;
  } else if (objectDataset.size === 1) {
    return objectToJsonldRepresentation(
      objectDataset.toArray()[0],
      dataset,
      contextUtil,
      proxyCreator
    );
  } else {
    return proxyCreator.createArrayProxy(
      [subject, predicate],
      dataset,
      contextUtil
    );
  }
}

export function createSubjectHander(
  dataset: Dataset,
  contextUtil: ContextUtil,
  proxyCreator: ProxyCreator
): ProxyHandler<ObjectWithId> {
  return {
    get(target: ObjectWithId, key: string) {
      return getValue(target, key, dataset, contextUtil, proxyCreator);
    },
    getOwnPropertyDescriptor(target: ObjectWithId, key: string) {
      const thing = {
        value: getValue(target, key, dataset, contextUtil, proxyCreator),
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
    // set: (target: ObjectWithId, key: string, value, ...args) => {
    //   addObjectToDataset(
    //     { "@id": target["@id"], [key]: value },
    //     dataset,
    //     context,
    //     new Set()
    //   );
    //   return Reflect.set(target, key, value, ...args);
    // },
  };
}
