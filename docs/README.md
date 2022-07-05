jsonld-dataset-proxy / [Exports](modules.md)

# JSONLD Dataset Proxy

Edit RDFJS Dataset just like regular JavaScript Object Literals.

Just a few lines of familiar code:
```typescript
const personNode = namedNode("http://example.com/Person1");
const person = jsonldDatasetProxy<IPerson>(dataset, PersonContext, personNode);
person.age = 23;
person.name.push("John");
```

are equivalent to:
```typescript
dataset.deleteMatches(
  namedNode("http://example.com/Person1"),
  namedNode("http://xmlns.com/foaf/0.1/age")
);
dataset.add(
  quad(
    namedNode("http://example.com/Person1"),
    namedNode("http://xmlns.com/foaf/0.1/age"),
    literal("23", "http://www.w3.org/2001/XMLSchema#integer")
  )
);
dataset.add(
  quad(
    namedNode("http://example.com/Person1"),
    namedNode("http://xmlns.com/foaf/0.1/name"),
    literal("John", "http://www.w3.org/2001/XMLSchema#string")
  )
);
```

Plus, you get IntelliSense typescript suggestions to help you write your code!

![Intellisense Example](./readme-images/Intellisense.png)

## Installation
```bash
npm install jsonld-dataset-proxy
```

## Simple Example
```typescript
import jsonldDatasetProxy from "jsonld-dataset-proxy";
import { ContextDefinition } from "jsonld";
import { serializedToDataset } from "o-dataset-pack";
import { namedNode } from "@rdfjs/data-model";

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
```

## Full Usage
For the most part, a JSONLD Dataset Proxy has parity with JavaScript Object Literals. However, there are a few differences to highlight. This section details how you would do different tasks.

### Defining a Context and Type
The first step to getting a JSONLD Dataset Proxy is defining the JSONLD Context and TypeScript Typings. This can either be done through a [generator](https://github.com/o-development/shexj2typeandcontext) or defining them manually.

In this example typescript typing `IPerson` is an interface that represents a person. Notice the `@id` and `@context` fields. Be sure to include them in your interfaces if you wish to use those properties.

```typescript
import { ContextDefinition } from "jsonld";

interface IPerson {
  "@id"?: string;
  "@context"?: ContextDefinition;
  name?: string[];
  age?: number;
  bestFriend?: IPerson;
  knows?: IPerson[];
}
```

We can make a [JSONLD context](https://w3c.github.io/json-ld-syntax/#the-context) to match this type:

```typescript
import { ContextDefinition } from "jsonld";

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
  bestFriend: {
    "@id": "http://xmlns.com/foaf/0.1/bestFriend",
    "@type": "@id",
  },
  knows: {
    "@id": "http://xmlns.com/foaf/0.1/knows",
    "@type": "@id",
    "@container": "@set",
  },
};
```

To do this, create an object that has corresponding fields to your type. Each field is an object that contains the following properties:
 - `@id`: indicates the URI of the corresponding predicate
 - `@type`: If the corresponding type is a pimitive (Like a number or string), use this field to list the RDF Literal type (Most often this is an XMLSchema type). If the corresponding type is an object, list `@id` here.
 - `@container`: If the corresponding type is an array of items, set `@container` to `@set`, if not, do not include the `@container` property.

Note that only the features described here work with JSONLD Dataset Proxy. Other features of JSONLD Contexts are not yet supported.

### Getting a JSONLD Dataset Proxy
Once the Typescript Typings and Context have been defined, we can get the JSONLD Dataset Proxy for a specific dataset.

```typescript
import jsonldDatasetProxy from "jsonld-dataset-proxy";
import { createDataset } from "o-dataset-pack";

const dataset = await createDataset();
// Make a JSONLD Dataset Proxy
const person = jsonldDatasetProxy<IPerson>(
  dataset,
  PersonContext,
  namedNode("http://example.com/Person1")
);
```

The functon `jsonldDatasetProxy` takes in three parameters:
 - `dataset`: The dataset you wish to traverse and manipulate. This can be any dataset that follows the [RDFJS Dataset Interface](https://rdf.js.org/dataset-spec/#dataset-interface). Note that this is not to be confused with the RDFJS Dataset ***Core*** interface. This example uses the "o-dataset-pack", but any implementation of the RDFJS Dataset Interface is acceptable.
 - `context`: The JSONLD context.
 - `entryNode`: The place of entry for the graph. The object returned by `jsonldDatasetProxy` will represent the given node. This parameter accepts both `namedNode`s and `blankNode`s.

The returned object is a JSONLD Dataset Proxy. The data of this proxy is automatically updated when the dataset itself is updated. Any modifications to this object will to automatically reflected in the dataset.

### Getting Field Values and Traversing
Getting a field and traversing the object is just as easy as getting data out of a standard JavaScript Object Literal.

In all the following example, we will use a dataset loaded with the following data:

```typescript
const dataset = await serializedToDataset(`
  @prefix example: <http://example.com/> .
  @prefix foaf: <http://xmlns.com/foaf/0.1/> .
  @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
  
  example:Person1
    foaf:name "Johnathan"^^xsd:string, "John"^^xsd:string;
    foaf:age "22"^^xsd:integer;
    foaf:bestFriend example:Person2;
    foaf:friends example:Person2, example:Person3.
  
  example:Person2
    foaf:name "Alice"^^xsd:string;
    foaf:age "28"^^xsd:integer.
  
  example:Person3
    foaf:name "Dave"^^xsd:string;
    foaf:age "33"^^xsd:integer.
`);
const person = jsonldDatasetProxy<IPerson>(
  dataset,
  PersonContext,
  namedNode("http://example.com/Person1")
);
// Get primitives
console.log(person.age); // 22
// Get nested primitives
console.log(person?.bestFriend?.age); // 28
// All array methods work
console.log(person.name?.reduce((agg, cur) => agg + cur, "")); // JonathanJohn
// You can also access array items via their index
// But this isn't recommened. The library will do its best to maintain the
// ordering in the array, but as datasets have no concept of order, this is
// not always accurate.
console.log(person.name?.[1]); // John
// Get the id of the object
// (If the node is a blankNode the @id will be undefined)
console.log(person.bestFriend?.["@id"]); // "http://example.com/Person2"
// Finally, you can retrieve the context
console.log(person["@context"]); // { "name": { "@id": ... }}
```

### Setting a Primitive
Setting a non-array primitive will remove the existing triple from the dataset and add a new triple.

```typescript
const dataset = createDataset();
const person = jsonldDatasetProxy<IPerson>(
  dataset,
  PersonContext,
  namedNode("http://example.com/Person1")
);
person.age = 23;
console.log(dataset.toString());
// <http://example.com/Person1> <http://xmlns.com/foaf/0.1/age> "23"^^<http://www.w3.org/2001/XMLSchema#integer> .
```

### Setting an Object
Setting a field to a JavaScript object literal will recursively add all parts of the object literal to the dataset.

```typescript
const dataset = createDataset();
const person = jsonldDatasetProxy<IPerson>(
  dataset,
  PersonContext,
  namedNode("http://example.com/Person1")
);
person.bestFriend = {
  "@id": "http://example.com/Person2",
  name: ["Alice"],
  bestFriend: {
    "@id": "http://example.com/Person3",
    name: ["Bob"],
  },
};
console.log(dataset.toString());
// <http://example.com/Person1> <http://xmlns.com/foaf/0.1/bestFriend> <http://example.com/Person2> .
// <http://example.com/Person2> <http://xmlns.com/foaf/0.1/bestFriend> <http://example.com/Person3> .
// <http://example.com/Person2> <http://xmlns.com/foaf/0.1/name> "Alice" .
// <http://example.com/Person3> <http://xmlns.com/foaf/0.1/name> "Bob" .
```

### Array Methods
Any methods that modify arrays work as expected.

```typescript
const dataset = await serializedToDataset(`
  @prefix example: <http://example.com/> .
  @prefix foaf: <http://xmlns.com/foaf/0.1/> .
  @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
  
  example:Person1
    foaf:name "Garrett"^^xsd:string, "Bobby"^^xsd:string.
`);
const person = jsonldDatasetProxy<IPerson>(
  dataset,
  PersonContext,
  namedNode("http://example.com/Person1")
);
person.name?.push("Ferguson");
console.log(dataset.toString());
// <http://example.com/Person1> <http://xmlns.com/foaf/0.1/name> "Garrett" .
// <http://example.com/Person1> <http://xmlns.com/foaf/0.1/name> "Bobby" .
// <http://example.com/Person1> <http://xmlns.com/foaf/0.1/name> "Ferguson" .
```

### Overwriting an Object
If an object literal is set and the id is equivalent to an existing id, that node will be overwritten. All triples from the previous object are removed and replaced with triples from the new object.

```typescript
const dataset = await serializedToDataset(`
  @prefix example: <http://example.com/> .
  @prefix foaf: <http://xmlns.com/foaf/0.1/> .
  @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
  
  example:Person2
    foaf:name "Alice"^^xsd:string;
    foaf:age "28"^^xsd:integer.
`);
const person = jsonldDatasetProxy<IPerson>(
  dataset,
  PersonContext,
  namedNode("http://example.com/Person1")
);
person.bestFriend = {
  "@id": "http://example.com/Person2",
  name: ["Jane"],
};
console.log(dataset.toString());
// <http://example.com/Person2> <http://xmlns.com/foaf/0.1/name> "Jane" .
// <http://example.com/Person1> <http://xmlns.com/foaf/0.1/bestFriend> <http://example.com/Person2> .
```

### Changing an Object's Id
You can rename an object by setting its `@id` field. This will update all triples that reference the id to the new id.

```typescript
const dataset = await serializedToDataset(`
  @prefix example: <http://example.com/> .
  @prefix foaf: <http://xmlns.com/foaf/0.1/> .
  @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

  example:Person1
    foaf:name "Alice"^^xsd:string;
    foaf:bestFriend example:Person2.
  
  example:Person2
    foaf:bestFriend example:Person1.
`);
const person = jsonldDatasetProxy<IPerson>(
  dataset,
  PersonContext,
  namedNode("http://example.com/Person1")
);
person["@id"] = "http://example.com/NewPersonId";
console.log(dataset.toString());
// <http://example.com/Person2> <http://xmlns.com/foaf/0.1/bestFriend> <http://example.com/NewPersonId> .
// <http://example.com/NewPersonId> <http://xmlns.com/foaf/0.1/name> "Alice" .
// <http://example.com/NewPersonId> <http://xmlns.com/foaf/0.1/bestFriend> <http://example.com/Person2> .
```

### Removing an Object Connection
Removing one triple can be done by setting a property to `undefined`;

```typescript
const dataset = await serializedToDataset(`
  @prefix example: <http://example.com/> .
  @prefix foaf: <http://xmlns.com/foaf/0.1/> .
  @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

  example:Person1
    foaf:name "Alice"^^xsd:string;
    foaf:bestFriend example:Person2.
  
  example:Person2
    foaf:name "Bob"^^xsd:string;
    foaf:bestFriend example:Person1.
`);
const person = jsonldDatasetProxy<IPerson>(
  dataset,
  PersonContext,
  namedNode("http://example.com/Person1")
);
person.bestFriend = undefined;
console.log(dataset.toString());
// <http://example.com/Person1> <http://xmlns.com/foaf/0.1/name> "Alice" .
// <http://example.com/Person2> <http://xmlns.com/foaf/0.1/name> "Bob" .
// <http://example.com/Person2> <http://xmlns.com/foaf/0.1/bestFriend> <http://example.com/Person1> .
```

### Deleting an Entire Object
If you want to delete all triples represented by an object, there are two ways using the `delete` operator.

First, you can call `delete` on a specific property:
```typescript
const dataset = await serializedToDataset(`
  @prefix example: <http://example.com/> .
  @prefix foaf: <http://xmlns.com/foaf/0.1/> .
  @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

  example:Person1
    foaf:name "Alice"^^xsd:string;
    foaf:bestFriend example:Person2.
  
  example:Person2
    foaf:name "Bob"^^xsd:string;
    foaf:bestFriend example:Person1.
`);
const person = jsonldDatasetProxy<IPerson>(
  dataset,
  PersonContext,
  namedNode("http://example.com/Person1")
);
delete person.bestFriend;
console.log(dataset.toString());
// <http://example.com/Person1> <http://xmlns.com/foaf/0.1/name> "Alice" .
```

And secondly, you can call `delete` on the `@id` property.
```typescript
const dataset = await serializedToDataset(`
  @prefix example: <http://example.com/> .
  @prefix foaf: <http://xmlns.com/foaf/0.1/> .
  @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

  example:Person1
    foaf:name "Alice"^^xsd:string;
    foaf:bestFriend example:Person2.
  
  example:Person2
    foaf:name "Bob"^^xsd:string;
    foaf:bestFriend example:Person1.
`);
const person = jsonldDatasetProxy<IPerson>(
  dataset,
  PersonContext,
  namedNode("http://example.com/Person1")
);
delete person["@id"];
console.log(dataset.toString());
// <http://example.com/Person2> <http://xmlns.com/foaf/0.1/name> "Bob" .
```

### Using Blank Nodes
If you want to create an object with a blankNode subject, simply omit the `@id` field when you're making the object.
```typescript
const dataset = await createDataset();
const person = jsonldDatasetProxy<IPerson>(
  dataset,
  PersonContext,
  namedNode("http://example.com/Person1")
);
person.bestFriend = {
  name: ["Charlie"],
};
console.log(dataset.toString());
// <http://example.com/Person1> <http://xmlns.com/foaf/0.1/bestFriend> _:b1 .
// _:b1 <http://xmlns.com/foaf/0.1/name> "Charlie" .
```

If your dataset has blank nodes and you want to assign that blank node as a triple's object, you can retrieve it from the JSONLD Dataset Proxy and assign it.
```typescript
const dataset = await serializedToDataset(`
  @prefix example: <http://example.com/> .
  @prefix foaf: <http://xmlns.com/foaf/0.1/> .
  @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
  
  example:Person1
    foaf:knows [
      foaf:name "Alice"^^xsd:string;
    ].
`);
const person = jsonldDatasetProxy<IPerson>(
  dataset,
  PersonContext,
  namedNode("http://example.com/Person1")
);
const alice = person.knows?.[0];
person.bestFriend = alice;
console.log(dataset.toString());
// _:n3-0 <http://xmlns.com/foaf/0.1/name> "Alice" .
// <http://example.com/Person1> <http://xmlns.com/foaf/0.1/knows> _:n3-0 .
// <http://example.com/Person1> <http://xmlns.com/foaf/0.1/bestFriend> _:n3-0 .
```

## Limitations
 - Currently this library only supports the following features of JSON-LD context:
   - "@id",
   - "@type",
   - "@container": "@set"
 - No support for named graphs (All additions are on the default graph)

## Liscense
MIT
