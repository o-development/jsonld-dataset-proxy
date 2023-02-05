import { BlankNode, Literal, NamedNode } from "@rdfjs/types";
import { namedNode, literal, blankNode } from "@rdfjs/data-model";
import { ContextUtil } from "../ContextUtil";
import { ProxyContext, _getUnderlyingNode } from "../types";
import { RawObject, RawValue } from "./RawObject";

export function getNodeFromRawObject(
  item: RawObject,
  contextUtil: ContextUtil
): NamedNode | BlankNode {
  if (item[_getUnderlyingNode]) {
    return item[_getUnderlyingNode] as NamedNode | BlankNode;
  } else if (!item["@id"]) {
    return blankNode();
  } else if (typeof item["@id"] === "string") {
    return namedNode(contextUtil.keyToIri(item["@id"]));
  } else {
    return item["@id"];
  }
}

export function getNodeFromRawValue(
  key: string,
  value: RawValue,
  proxyContext: ProxyContext
): BlankNode | NamedNode | Literal | undefined {
  // Get the Object Node
  if (value == undefined) {
    return undefined;
  } else if (
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number"
  ) {
    const datatype = proxyContext.contextUtil.getType(key);
    if (datatype === "@id") {
      return namedNode(value.toString());
    } else {
      return literal(value.toString(), datatype);
    }
  } else {
    return getNodeFromRawObject(value, proxyContext.contextUtil);
  }
}
