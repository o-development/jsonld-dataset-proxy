import { Dataset } from "@rdfjs/types";
import { ContextUtil } from "../ContextUtil";
import { ObjectWithId } from "../createSubjectHandler";
import { ProxyCreator } from "../ProxyCreator";
import { namedNode } from "@rdfjs/data-model";
import { objectToJsonldRepresentation } from "./objectToJsonRepresentation";

export function getProxyFromDataset(
  target: ObjectWithId,
  key: string | symbol,
  dataset: Dataset,
  contextUtil: ContextUtil,
  proxyCreator: ProxyCreator
) {
  if (key === "@id") {
    if (target["@id"].termType === "BlankNode") {
      return undefined;
    }
    return target["@id"].value;
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
