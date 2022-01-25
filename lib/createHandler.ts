import { Dataset, Literal, NamedNode } from "@rdfjs/types";
import { ContextDefinition, ExpandedTermDefinition } from "jsonld";
import { namedNode, quad, literal } from "@rdfjs/dataset";

function getContextIri(context: ContextDefinition, key: string) {
  if (!context[key]) {
    return key;
  } else if (typeof context[key] === "string") {
    return context[key];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } else if (context[key] && (context[key] as any)["@id"]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (context[key] as any)["@id"];
  }
}

function getContextType(context: ContextDefinition, key: string) {
  if (
    typeof context[key] === "object" &&
    (context[key] as ExpandedTermDefinition)["@type"]
  ) {
    return (context[key] as ExpandedTermDefinition)["@type"];
  }
  return "http://www.w3.org/2001/XMLSchema#string";
}

export function createHander(
  inputDataset: Dataset,
  context: ContextDefinition
): ProxyHandler<object> {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: (target: any, key) => {
      if (Array.isArray(target)) {
        if (key === "push") {
          const pushFunction: Array<unknown>["push"] = (...items) => {
            console.log("push");
            return target.push(...items);
          };
          return pushFunction;
        }
      }
      if (typeof target[key] === "object" && target[key] != null) {
        return new Proxy(target[key], createHander(inputDataset, context));
      }
      return target[key];
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: (target: any, key: string, value, ...args) => {
      const subject = namedNode(target["@id"]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const predicate = namedNode(getContextIri(context, key));
      let object: NamedNode | Literal;
      if (typeof value !== "object") {
        const datatype = getContextType(context, key);
        if (datatype === "@id") {
          object = namedNode(value);
        } else {
          object = literal(value, datatype);
        }
      } else if (value["@id"]) {
        object = namedNode(value["@id"]);
      } else {
        throw Error("Set object does not have an @id");
      }
      inputDataset.deleteMatches(subject, predicate);
      inputDataset.add(quad(subject, predicate, object));
      return Reflect.set(target, key, value, ...args);
    },
  };
}
