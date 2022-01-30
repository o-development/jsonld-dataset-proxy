import { Dataset, Quad } from "@rdfjs/types";
import { ContextUtil } from "../ContextUtil";
import { ObjectWithId } from "../createSubjectHandler";
import { ProxyCreator } from "../ProxyCreator";

export type ObjectJsonRepresentation = string | number | boolean | ObjectWithId;

export function objectToJsonldRepresentation(
  quad: Quad,
  dataset: Dataset,
  contextUtil: ContextUtil,
  proxyCreator: ProxyCreator
): ObjectJsonRepresentation {
  if (quad.object.termType === "Literal") {
    switch (quad.object.datatype.value) {
      case "http://www.w3.org/2001/XMLSchema#string":
      case "http://www.w3.org/2001/XMLSchema#ENTITIES":
      case "http://www.w3.org/2001/XMLSchema#ENTITY":
      case "http://www.w3.org/2001/XMLSchema#ID":
      case "http://www.w3.org/2001/XMLSchema#IDREF":
      case "http://www.w3.org/2001/XMLSchema#IDREFS":
      case "http://www.w3.org/2001/XMLSchema#language":
      case "http://www.w3.org/2001/XMLSchema#Name":
      case "http://www.w3.org/2001/XMLSchema#NCName":
      case "http://www.w3.org/2001/XMLSchema#NMTOKEN":
      case "http://www.w3.org/2001/XMLSchema#NMTOKENS":
      case "http://www.w3.org/2001/XMLSchema#normalizedString":
      case "http://www.w3.org/2001/XMLSchema#QName":
      case "http://www.w3.org/2001/XMLSchema#token":
        return quad.object.value;
      case "http://www.w3.org/2001/XMLSchema#date":
      case "http://www.w3.org/2001/XMLSchema#dateTime":
      case "http://www.w3.org/2001/XMLSchema#duration":
      case "http://www.w3.org/2001/XMLSchema#gDay":
      case "http://www.w3.org/2001/XMLSchema#gMonth":
      case "http://www.w3.org/2001/XMLSchema#gMonthDay":
      case "http://www.w3.org/2001/XMLSchema#gYear":
      case "http://www.w3.org/2001/XMLSchema#gYearMonth":
      case "http://www.w3.org/2001/XMLSchema#time":
        return quad.object.value;
      case "http://www.w3.org/2001/XMLSchema#integer":
      case "http://www.w3.org/2001/XMLSchema#byte":
      case "http://www.w3.org/2001/XMLSchema#decimal":
      case "http://www.w3.org/2001/XMLSchema#int":
      case "http://www.w3.org/2001/XMLSchema#long":
      case "http://www.w3.org/2001/XMLSchema#negativeInteger":
      case "http://www.w3.org/2001/XMLSchema#nonNegativeInteger":
      case "http://www.w3.org/2001/XMLSchema#nonPositiveInteger":
      case "http://www.w3.org/2001/XMLSchema#positiveInteger":
      case "http://www.w3.org/2001/XMLSchema#short":
      case "http://www.w3.org/2001/XMLSchema#unsignedLong":
      case "http://www.w3.org/2001/XMLSchema#unsignedInt":
      case "http://www.w3.org/2001/XMLSchema#unsignedShort":
      case "http://www.w3.org/2001/XMLSchema#unsignedByte":
        return parseFloat(quad.object.value);
      case "http://www.w3.org/2001/XMLSchema#boolean":
        return quad.object.value === "true";
      case "http://www.w3.org/2001/XMLSchema#hexBinary":
        return quad.object.value;
      case "http://www.w3.org/2001/XMLSchema#anyURI":
        return quad.object.value;
      default:
        return quad.object.value;
    }
  } else if (
    quad.object.termType === "NamedNode" ||
    quad.object.termType === "BlankNode"
  ) {
    return proxyCreator.createSubjectProxy(quad.object, dataset, contextUtil);
  } else {
    throw new Error("Cannot handle things that are not NamedNodes or literals");
  }
}
