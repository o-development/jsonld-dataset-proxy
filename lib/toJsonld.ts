import SerializerJsonld from "@rdfjs/serializer-jsonld-ext";
import { Dataset, NamedNode } from "@rdfjs/types";
import { ContextDefinition, JsonLdDocument } from "jsonld";
import { jsonld2graphobject } from "jsonld2graphobject";

export async function toJsonld<JsonType>(
  inputDataset: Dataset,
  context: ContextDefinition,
  entryNode: NamedNode
): Promise<JsonType> {
  return new Promise(async (resolve) => {
    const serializerJsonld = new SerializerJsonld({
      context,
      compact: true,
    });
    const input = inputDataset.toStream();
    const output = serializerJsonld.import(input, { compact: true });
    output.on("data", async (jsonld: JsonLdDocument) => {
      try {
        const processedObject = (await jsonld2graphobject(
          jsonld,
          entryNode.value
        )) as unknown as JsonType;
        resolve(processedObject);
      } catch (err: unknown) {
        if ((err as Error).message.includes("is not in the graph.")) {
          resolve({ "@id": entryNode.value } as unknown as JsonType);
        }
      }
    });
  });
}
