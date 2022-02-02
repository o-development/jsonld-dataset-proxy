import jsonldDatasetProxy from "../lib";
import { ContextDefinition } from "jsonld";
import { serializedToDataset } from "o-dataset-pack";
import { namedNode } from "@rdfjs/dataset";

async function start() {
  // Define initial data
  const initialData = `
    @prefix example: <http://example.com/> .
    @prefix foaf: <http://xmlns.com/foaf/0.1/> .
    @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
    
    example:Person1
      foaf:name "Johnathan"^^xsd:string;
      foaf:age "22"^^xsd:integer.
  `;
  // Create a dataset loaded with initial data
  const dataset = await serializedToDataset(initialData);
  // Make a JSONLD Dataset Proxy
  const person = jsonldDatasetProxy<IPerson>(
    dataset,
    PersonContext,
    namedNode("http://example.com/Person1")
  );
  // Make Modifications
  person.age = 23;
  person.name.push("John");

  console.log(dataset.toString);
  // Logs:
  // <http://example.com/Person1> <http://xmlns.com/foaf/0.1/name> "Johnathan" .
  // <http://example.com/Person1> <http://xmlns.com/foaf/0.1/name> "John" .
  // <http://example.com/Person1> <http://xmlns.com/foaf/0.1/age> "23"^^<http://www.w3.org/2001/XMLSchema#integer> .
}

// Person Typescript Typing
interface IPerson {
  name: string[];
  age: number;
}

// Person JSONLD Context
const PersonContext: ContextDefinition = {
  name: {
    "@id": "http://xmlns.com/foaf/0.1/name",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@container": "@set",
  },
  age: {
    "@id": "http://xmlns.com/foaf/0.1/age",
    "@type": "http://www.w3.org/2001/XMLSchema#integer",
  },
};

start();
