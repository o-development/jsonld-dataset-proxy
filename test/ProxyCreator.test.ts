import { namedNode, defaultGraph } from "@rdfjs/dataset";
import { createDataset } from "o-dataset-pack";
import { ContextUtil } from "../lib/ContextUtil";
import { ProxyCreator } from "../lib/ProxyCreator";

describe("ProxyCreator", () => {
  it("handles strange array proxies", () => {
    const contextUtil = new ContextUtil({});
    const dataset = createDataset();
    const graph = defaultGraph();
    const proxyCreator = new ProxyCreator();
    const object = namedNode("http://example.com");
    const proxy = proxyCreator.createArrayProxy(
      [null, null, object, graph],
      dataset,
      contextUtil
    );
    expect(proxy).toEqual([]);
  });
});
