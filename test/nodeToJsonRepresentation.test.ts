import { createDataset } from "o-dataset-pack";
import { ContextUtil } from "../lib/ContextUtil";
import { nodeToJsonldRepresentation } from "../lib/util/nodeToJsonldRepresentation";
import { literal, defaultGraph } from "@rdfjs/data-model";
import { ProxyContext } from "../lib";

describe("objectToJsonRepresentation", () => {
  const extraParams: ProxyContext = new ProxyContext({
    dataset: createDataset(),
    contextUtil: new ContextUtil({}),
    writeGraphs: [defaultGraph()],
  });

  it("returns a string for hexBinary", () => {
    expect(
      nodeToJsonldRepresentation(
        literal("F03493", "http://www.w3.org/2001/XMLSchema#hexBinary"),
        extraParams
      )
    ).toBe("F03493");
  });

  it("returns a string for anyUri", () => {
    expect(
      nodeToJsonldRepresentation(
        literal(
          "http://example.com",
          "http://www.w3.org/2001/XMLSchema#anyURI"
        ),
        extraParams
      )
    ).toBe("http://example.com");
  });

  it("returns a string for an unrecognized datatype", () => {
    expect(
      nodeToJsonldRepresentation(
        literal("meh", "http://weirddatatype.com"),
        extraParams
      )
    ).toBe("meh");
  });

  it("throws an error when it encoutners a quad that is not a Liter, NamedNode, or BlankNode", () => {
    expect(() =>
      // @ts-expect-error defaultGraph is not allowed
      nodeToJsonldRepresentation(defaultGraph(), extraParams)
    ).toThrow("Can only convert NamedNodes or Literals or BlankNodes");
  });
});
