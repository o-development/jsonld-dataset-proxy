import { profile as profileData } from "./testData";
import SerializerJsonld from "@rdfjs/serializer-jsonld-ext";
import { Dataset, NamedNode } from "@rdfjs/types";
import {
  ContextDefinition,
  ExpandedTermDefinition,
  JsonLdDocument,
} from "jsonld";
import { namedNode, defaultGraph, quad, literal } from "@rdfjs/dataset";
import { SolidProfileShape } from "./profileTypes";
import { serializedToSubscribableDataset } from "o-dataset-pack";
import { jsonld2graphobject } from "jsonld2graphobject";

Array.prototype.push;

async function toJson<JsonType>(
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
      resolve(
        (await jsonld2graphobject(
          jsonld,
          entryNode.value
        )) as unknown as JsonType
      );
    });
  });
}

async function toJsonManipulator<JsonType>(
  inputDataset: Dataset,
  context: ContextDefinition,
  entryNode: NamedNode
): Promise<JsonType> {
  const rawJson = await toJson<JsonType>(inputDataset, context, entryNode);

  /**
   * Recursively Create Handler
   */
  const createHander = (): ProxyHandler<object> => ({
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
        return new Proxy(target[key], createHander());
      }
      return target[key];
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set: (target: any, key: string, value, ...args) => {
      const subject = target["@id"];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const predicate = (context[key] as any)["@id"];
      const object = value;
      inputDataset.add(
        quad(namedNode(subject), namedNode(predicate), literal(object))
      );
      return Reflect.set(target, key, value, ...args);
    },
  });

  return new Proxy(
    rawJson as unknown as object,
    createHander()
  ) as unknown as JsonType;
}

async function run() {
  const dataset = await serializedToSubscribableDataset(
    profileData.sampleTurtle
  );
  dataset.on(defaultGraph(), (curDataset, changes) => {
    console.log("Added Quads:");
    console.log(changes.added?.toString());
    console.log("Removed Quads:");
    console.log(changes.removed?.toString());
  });

  const transactionDataset = dataset.startTransaction();
  const profile = await toJsonManipulator<SolidProfileShape>(
    transactionDataset,
    profileData.successfulContext,
    namedNode("https://jackson.solidcommunity.net/profile/card#me")
  );

  profile.fn = "Jackson the Very Very Cool";
  if (!profile.hasTelephone) {
    profile.hasTelephone = [];
  }
  profile.hasTelephone?.push({
    type: "Home",
    value: "555-555-5555",
  });

  transactionDataset.commit();
}
run();
