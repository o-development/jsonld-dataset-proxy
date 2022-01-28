import { createDataset } from "o-dataset-pack";
import { ContextUtil } from "../lib/ContextUtil";
import { objectToJsonldRepresentation } from "../lib/helperFunctions/objectToJsonRepresentation";
import { ProxyCreator } from "../lib/ProxyCreator";
import { quad, namedNode, literal, blankNode } from "@rdfjs/dataset";
import { Dataset } from "@rdfjs/types";

describe("objectToJsonRepresentation", () => {
  const extraParams: [
    dataset: Dataset,
    contextUtil: ContextUtil,
    proxyCreator: ProxyCreator
  ] = [createDataset(), new ContextUtil({}), new ProxyCreator()];

  it("returns a string for hexBinary", () => {
    expect(
      objectToJsonldRepresentation(
        quad(
          namedNode("http://example.com/patient1"),
          namedNode("http://example.com/someHex"),
          literal("F03493", "http://www.w3.org/2001/XMLSchema#hexBinary")
        ),
        ...extraParams
      )
    ).toBe("F03493");
  });

  it("returns a string for anyUri", () => {
    expect(
      objectToJsonldRepresentation(
        quad(
          namedNode("http://example.com/patient1"),
          namedNode("http://example.com/someHex"),
          literal(
            "http://example.com",
            "http://www.w3.org/2001/XMLSchema#anyURI"
          )
        ),
        ...extraParams
      )
    ).toBe("http://example.com");
  });

  it("returns a string for an unrecognized datatype", () => {
    expect(
      objectToJsonldRepresentation(
        quad(
          namedNode("http://example.com/patient1"),
          namedNode("http://example.com/someHex"),
          literal("meh", "http://weirddatatype.com")
        ),
        ...extraParams
      )
    ).toBe("meh");
  });

  it("throws an error if the object is not a namedNode or a Literal", () => {
    expect(() => {
      objectToJsonldRepresentation(
        quad(
          namedNode("http://example.com/patient1"),
          namedNode("http://example.com/someHex"),
          blankNode()
        ),
        ...extraParams
      );
    }).toThrow("Cannot handle things that are not NamedNodes or literals");
  });
});
