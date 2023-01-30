import { ObjectWithId } from "../createSubjectHandler";
import { namedNode } from "@rdfjs/data-model";
import { objectToJsonldRepresentation } from "./objectToJsonRepresentation";
import { ProxyContext } from "../ProxyContext";

export function getProxyFromDataset(
  target: ObjectWithId,
  key: string | symbol,
  proxyContext: ProxyContext
) {
  const { contextUtil, dataset, proxyCreator } = proxyContext;
  if (key === "@id") {
    if (target["@id"].termType === "BlankNode") {
      return undefined;
    }
    return contextUtil.iriToKey(target["@id"].value);
  }
  if (key === "@context") {
    return contextUtil.context;
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
  const subject = target["@id"];
  const predicate = namedNode(contextUtil.keyToIri(key));
  if (contextUtil.isArray(key)) {
    const arrayProxy = proxyCreator.createArrayProxy(
      [subject, predicate],
      proxyContext
    );
    return arrayProxy;
  }
  const objectDataset = dataset.match(subject, predicate);
  if (objectDataset.size === 0) {
    return undefined;
  } else if (objectDataset.size === 1) {
    return objectToJsonldRepresentation(
      objectDataset.toArray()[0],
      proxyContext
    );
  } else {
    return proxyCreator.createArrayProxy([subject, predicate], proxyContext);
  }
}
