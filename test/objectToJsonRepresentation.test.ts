import { createDataset } from "o-dataset-pack";
import { ContextUtil } from "../lib/ContextUtil";
import { objectToJsonldRepresentation } from "../lib/helperFunctions/objectToJsonRepresentation";
import { ProxyCreator } from "../lib/ProxyCreator";
import { quad, namedNode, literal, defaultGraph } from "@rdfjs/dataset";
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

  it("throws an error when it encoutners a quad that is not a Liter, NamedNode, or BlankNode", () => {
    expect(() =>
      objectToJsonldRepresentation(
        quad(
          namedNode("http://example.com/patient1"),
          namedNode("http://example.com/someHex"),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          defaultGraph()
        ),
        ...extraParams
      )
    ).toThrow("Can only convert NamedNodes or Literals or BlankNodes");
  });
});
