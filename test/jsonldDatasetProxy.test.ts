import { createDataset, serializedToDataset } from "o-dataset-pack";
import {
  jsonldDatasetProxy,
  JsonldDatasetProxyBuilder,
  write,
  _getUnderlyingDataset,
  _getUnderlyingMatch,
  _getUnderlyingNode,
  _isSubjectOriented,
  _readGraphs,
  _writeGraphs,
} from "../lib";
import {
  ObservationShape,
  patientData,
  PatientShape,
  patientContext,
  tinyPatientData,
  tinyArrayPatientData,
  patientDataWithBlankNodes,
  tinyPatientDataWithBlankNodes,
} from "./patientExampleData";
import { namedNode, quad, literal } from "@rdfjs/data-model";
import { Dataset, NamedNode } from "@rdfjs/types";
import { ContextDefinition } from "jsonld";

describe("jsonldDatasetProxy", () => {
  async function getLoadedDataset(): Promise<
    [Dataset, ObservationShape, JsonldDatasetProxyBuilder]
  > {
    const dataset = await serializedToDataset(patientData);
    const builder = await jsonldDatasetProxy(dataset, patientContext);
    return [
      dataset,
      builder.fromSubject(namedNode("http://example.com/Observation1")),
      builder,
    ];
  }

  async function getLoadedDatasetWithBlankNodes(): Promise<
    [Dataset, ObservationShape, JsonldDatasetProxyBuilder]
  > {
    const dataset = await serializedToDataset(patientDataWithBlankNodes);
    const builder = await jsonldDatasetProxy(dataset, patientContext);
    return [
      dataset,
      builder.fromSubject(namedNode("http://example.com/Observation1")),
      builder,
    ];
  }

  async function getTinyLoadedDataset(): Promise<
    [Dataset, ObservationShape, JsonldDatasetProxyBuilder]
  > {
    const dataset = await serializedToDataset(tinyPatientData);
    const builder = await jsonldDatasetProxy(dataset, patientContext);
    return [
      dataset,
      builder.fromSubject(namedNode("http://example.com/Observation1")),
      builder,
    ];
  }

  async function getGraphLoadedDataset(): Promise<
    [Dataset, ObservationShape, JsonldDatasetProxyBuilder]
  > {
    const tempDataset = await serializedToDataset(patientData);
    const dataset = createDataset();
    const subjectGraphMap: Record<string, NamedNode> = {
      "http://example.com/Observation1": namedNode(
        "http://example.com/Observation1Doc"
      ),
      "http://example.com/Patient1": namedNode(
        "http://example.com/Patient1Doc"
      ),
      "http://example.com/Patient2": namedNode(
        "http://example.com/Patient2Doc"
      ),
      "http://example.com/Patient3": namedNode(
        "http://example.com/Patient3Doc"
      ),
    };
    tempDataset.forEach((tempQuad) => {
      dataset.add(
        quad(
          tempQuad.subject,
          tempQuad.predicate,
          tempQuad.object,
          subjectGraphMap[tempQuad.subject.value]
        )
      );
    });
    const builder = await jsonldDatasetProxy(dataset, patientContext);
    return [
      dataset,
      builder.fromSubject(namedNode("http://example.com/Observation1")),
      builder,
    ];
  }

  async function getTinyLoadedDatasetWithBlankNodes(): Promise<
    [Dataset, ObservationShape, JsonldDatasetProxyBuilder]
  > {
    const dataset = await serializedToDataset(tinyPatientDataWithBlankNodes);
    const builder = await jsonldDatasetProxy(dataset, patientContext);
    return [
      dataset,
      builder.fromSubject(namedNode("http://example.com/Observation1")),
      builder,
    ];
  }

  async function getArrayLoadedDataset(): Promise<
    [Dataset, PatientShape, JsonldDatasetProxyBuilder]
  > {
    const dataset = await serializedToDataset(tinyArrayPatientData);
    const builder = await jsonldDatasetProxy(dataset, patientContext);
    return [
      dataset,
      builder.fromSubject(namedNode("http://example.com/Patient1")),
      builder,
    ];
  }

  async function getEmptyObservationDataset(): Promise<
    [Dataset, ObservationShape, JsonldDatasetProxyBuilder]
  > {
    const dataset = await createDataset();
    const builder = await jsonldDatasetProxy(dataset, patientContext);
    return [
      dataset,
      builder.fromSubject(namedNode("http://example.com/Observation1")),
      builder,
    ];
  }

  async function getEmptyPatientDataset(): Promise<
    [Dataset, PatientShape, JsonldDatasetProxyBuilder]
  > {
    const dataset = await createDataset();
    const builder = await jsonldDatasetProxy(dataset, patientContext);
    return [
      dataset,
      builder.fromSubject(namedNode("http://example.com/Patient1")),
      builder,
    ];
  }

  describe("read", () => {
    it("retreives a primitive", async () => {
      const [, observation] = await getLoadedDataset();
      expect(observation["@id"]).toBe("http://example.com/Observation1");
      expect(observation.notes).toBe("Cool Notes");
    });

    it("retreives a primitive with blank nodes", async () => {
      const [, observation] = await getLoadedDatasetWithBlankNodes();
      expect(observation.subject?.age).toBe(35);
    });

    it("retrieves a nested primitive", async () => {
      const [, observation] = await getLoadedDataset();
      expect(observation?.subject && observation.subject["@id"]).toBe(
        "http://example.com/Patient1"
      );
      expect(observation?.subject?.age).toBe(35);
      expect(observation?.subject?.birthdate).toBe("1986-01-01");
      expect(observation?.subject?.isHappy).toBe(true);
    });

    it("retrieves a nested primitive with a blank node", async () => {
      const [, observation] = await getLoadedDatasetWithBlankNodes();
      expect(observation?.subject?.roommate?.[0].age).toBe(34);
    });

    it("retreives a @type value as rdf:type", async () => {
      const [, observation] = await getLoadedDataset();
      expect(observation.subject?.type?.["@id"]).toBe("Patient");
    });

    it("simulates the getter behavior of an array of primitives", async () => {
      const [, observation] = await getLoadedDataset();
      const arr = observation?.subject?.name as string[];
      expect(Array.isArray(arr)).toBe(true);
      expect(arr.length).toBe(3);
      expect(arr[0]).toBe("Garrett");
      expect(arr[1]).toBe("Bobby");
      expect(arr[2]).toBe("Ferguson");
      expect(arr.at(0)).toBe("Garrett");
      expect(arr.at(-1)).toBe("Ferguson");
      expect(arr.concat(["Mimoey"])).toEqual([
        "Garrett",
        "Bobby",
        "Ferguson",
        "Mimoey",
      ]);
      const entriesIterator = arr.entries();
      expect(entriesIterator.next()).toEqual({
        value: [0, "Garrett"],
        done: false,
      });
      expect(entriesIterator.next()).toEqual({
        value: [1, "Bobby"],
        done: false,
      });
      expect(entriesIterator.next()).toEqual({
        value: [2, "Ferguson"],
        done: false,
      });
      expect(entriesIterator.next()).toEqual({
        value: undefined,
        done: true,
      });
      expect(arr.every((val) => val.length > 2)).toBe(true);
      expect(arr.every((val) => val.length > 6)).toBe(false);
      expect(arr.filter((val) => val.length > 6)).toEqual([
        "Garrett",
        "Ferguson",
      ]);
      expect(arr.find((val) => val.length < 6)).toBe("Bobby");
      expect(arr.findIndex((val) => val.length < 6)).toBe(1);
      // arr.flat (Not included because there should never be nested arrays)
      let concatTest = "";
      arr.forEach((value) => (concatTest += value));
      expect(concatTest).toBe("GarrettBobbyFerguson");
      expect(arr.includes("Bobby")).toBe(true);
      expect(arr.indexOf("Bobby")).toBe(1);
      expect(arr.join("-")).toBe("Garrett-Bobby-Ferguson");
      const keysIterator = arr.keys();
      expect(keysIterator.next()).toEqual({
        value: 0,
        done: false,
      });
      expect(keysIterator.next()).toEqual({
        value: 1,
        done: false,
      });
      expect(keysIterator.next()).toEqual({
        value: 2,
        done: false,
      });
      expect(keysIterator.next()).toEqual({
        value: undefined,
        done: true,
      });
      expect(arr.lastIndexOf("Bobby")).toBe(1);
      expect(arr.map((val) => val.toUpperCase())).toEqual([
        "GARRETT",
        "BOBBY",
        "FERGUSON",
      ]);
      expect(arr.reduce((agg, val) => agg + val, "")).toBe(
        "GarrettBobbyFerguson"
      );
      expect(arr.slice(2)).toEqual(["Ferguson"]);
      expect(arr.some((val) => val.startsWith("G"))).toBe(true);
      expect(arr.toString()).toBe("Garrett,Bobby,Ferguson");
      const valuesIterator = arr.values();
      expect(valuesIterator.next()).toEqual({
        value: "Garrett",
        done: false,
      });
      expect(valuesIterator.next()).toEqual({
        value: "Bobby",
        done: false,
      });
      expect(valuesIterator.next()).toEqual({
        value: "Ferguson",
        done: false,
      });
      expect(valuesIterator.next()).toEqual({
        value: undefined,
        done: true,
      });
      expect(JSON.stringify(arr)).toBe(`["Garrett","Bobby","Ferguson"]`);
      expect(arr.toString()).toBe("Garrett,Bobby,Ferguson");
    });

    it("can traverse a circular graph", async () => {
      const [, observation] = await getLoadedDataset();
      expect(observation.subject?.roommate?.[0].roommate?.[0]?.name?.[0]).toBe(
        "Garrett"
      );
    });

    it("simulates getter object properties", async () => {
      const [, observation] = await getLoadedDataset();
      const obj = observation.subject as PatientShape;

      expect(obj["@id"]).toEqual("http://example.com/Patient1");
      expect(obj.type).toEqual({ "@id": "Patient" });
      expect(obj.name).toEqual(["Garrett", "Bobby", "Ferguson"]);
      expect(obj.birthdate).toEqual("1986-01-01");
      expect(obj.age).toEqual(35);
      expect(obj.isHappy).toEqual(true);
      const entries = Object.entries(obj);
      expect(entries[0]).toEqual(["@id", "http://example.com/Patient1"]);
      expect(entries[1]).toEqual(["type", { "@id": "Patient" }]);
      expect(entries[2]).toEqual(["name", ["Garrett", "Bobby", "Ferguson"]]);
      expect(entries[3]).toEqual(["birthdate", "1986-01-01"]);
      expect(entries[4]).toEqual(["age", 35]);
      expect(entries[5]).toEqual(["isHappy", true]);
      expect(entries[6][0]).toEqual("roommate");
      expect(Object.keys(obj)).toEqual([
        "@id",
        "type",
        "name",
        "birthdate",
        "age",
        "isHappy",
        "roommate",
      ]);
      const values = Object.values(obj);
      expect(values[0]).toEqual("http://example.com/Patient1");
      expect(values[1]).toEqual({ "@id": "Patient" });
      expect(values[2]).toEqual(["Garrett", "Bobby", "Ferguson"]);
      expect(values[3]).toEqual("1986-01-01");
      expect(values[4]).toEqual(35);
      expect(values[5]).toEqual(true);
    });

    it("handles stringification of a non circular object", async () => {
      const [, observation] = await getLoadedDataset();
      const obj = observation.subject?.roommate?.[1] as PatientShape;
      expect(obj.toString()).toBe("[object Object]");
      expect(JSON.stringify(obj)).toBe(
        `{"@id":"http://example.com/Patient3","type":{"@id":"Patient"},"name":["Amy"],"birthdate":"1988-01-01","age":33,"isHappy":true}`
      );
    });

    it("Returns an array for required array fields even if no data is in the dataset", async () => {
      const [, observation] = await getLoadedDataset();
      const obj = observation.subject?.roommate?.[1] as PatientShape;
      expect(obj.roommate).toEqual([]);
    });

    it("updates when the dataset is updated", async () => {
      const [dataset, observation] = await getLoadedDataset();
      expect(observation.notes).toBe("Cool Notes");
      dataset.delete(
        quad(
          namedNode("http://example.com/Observation1"),
          namedNode("http://hl7.org/fhir/notes"),
          literal("Cool Notes", "http://www.w3.org/2001/XMLSchema#string")
        )
      );
      dataset.add(
        quad(
          namedNode("http://example.com/Observation1"),
          namedNode("http://hl7.org/fhir/notes"),
          literal("Bad Notes", "http://www.w3.org/2001/XMLSchema#string")
        )
      );
      expect(observation.notes).toBe("Bad Notes");
    });

    it("handles stringfication of a circular object", async () => {
      const [, observation] = await getLoadedDataset();
      const obj = observation.subject as PatientShape;
      expect(obj.toString()).toBe("[object Object]");

      expect(() => JSON.stringify(obj)).toThrow(
        "Converting circular structure to JSON"
      );
    });

    it("returns undefined if called with an unrecognized symbol", async () => {
      const [, observation] = await getLoadedDataset();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(observation[Symbol.toPrimitive]).toBe(undefined);
    });

    it("returns an array object if multiple triples exist, even if @container is not @set", async () => {
      const dataset = await serializedToDataset(patientData);
      const fakePatientSContext: ContextDefinition = {
        name: {
          "@id": "http://hl7.org/fhir/name",
          "@type": "http://www.w3.org/2001/XMLSchema#string",
        },
      };
      const builder = jsonldDatasetProxy(dataset, fakePatientSContext);
      const patient = builder.fromSubject(
        namedNode("http://example.com/Patient1")
      );
      expect(patient.name).toEqual(["Garrett", "Bobby", "Ferguson"]);
    });

    it("returns context when the @context key is called", async () => {
      const [, observation] = await getLoadedDataset();
      expect(observation["@context"]).toEqual(patientContext);
    });
  });

  describe("write", () => {
    it("sets a primitive value that doesn't exist yet", async () => {
      const [dataset, observation] = await getEmptyObservationDataset();
      observation.notes = "Cool Notes";
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/notes> "Cool Notes" .\n'
      );
    });

    it("sets primitive number and boolean values", async () => {
      const [dataset, patient] = await getEmptyPatientDataset();
      patient.age = 35;
      patient.isHappy = true;
      expect(dataset.toString()).toBe(
        '<http://example.com/Patient1> <http://hl7.org/fhir/age> "35"^^<http://www.w3.org/2001/XMLSchema#integer> .\n<http://example.com/Patient1> <http://hl7.org/fhir/isHappy> "true"^^<http://www.w3.org/2001/XMLSchema#boolean> .\n'
      );
    });

    it("sets a @type value as rdf:type", async () => {
      const [dataset, patient] = await getEmptyPatientDataset();
      patient.type = { "@id": "Patient" };
      expect(dataset.toString()).toBe(
        "<http://example.com/Patient1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://hl7.org/fhir/Patient> .\n"
      );
    });

    it("replaces a primitive value that currently exists", async () => {
      const [dataset, observation] = await getEmptyObservationDataset();
      dataset.add(
        quad(
          namedNode("http://example.com/Observation1"),
          namedNode("http://hl7.org/fhir/notes"),
          literal("Cool Notes")
        )
      );
      observation.notes = "Lame Notes";
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/notes> "Lame Notes" .\n'
      );
    });

    it("adds all quads from a set object", async () => {
      const [dataset, observation] = await getEmptyObservationDataset();
      const patient: PatientShape = {
        "@id": "http://example.com/Patient1",
        birthdate: "2001-01-01",
      };
      observation.subject = patient;
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/subject> <http://example.com/Patient1> .\n<http://example.com/Patient1> <http://hl7.org/fhir/birthdate> "2001-01-01"^^<http://www.w3.org/2001/XMLSchema#date> .\n'
      );
    });

    it("sets a retrieved blank node object", async () => {
      const [, observation] = await getTinyLoadedDatasetWithBlankNodes();
      const patient2 = observation.subject?.roommate?.[0] as PatientShape;
      observation.subject = patient2;
      expect(observation.subject.name).toEqual(["Rob"]);
      expect(observation.subject.roommate?.[0]?.name).toEqual(["Garrett"]);
      expect(observation.subject.roommate?.[0]?.roommate?.[0].name).toEqual([
        "Rob",
      ]);
    });

    it("only removes the connection when a value is set to undefined", async () => {
      const [dataset, observation] = await getTinyLoadedDataset();
      observation.subject = undefined;
      expect(dataset.toString()).toBe(
        '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/Patient1> <http://hl7.org/fhir/roommate> <http://example.com/Patient2> .\n<http://example.com/Patient2> <http://hl7.org/fhir/name> "Rob" .\n<http://example.com/Patient2> <http://hl7.org/fhir/roommate> <http://example.com/Patient1> .\n'
      );
    });

    it("Creates a blank node if the id is blank during set", async () => {
      const [dataset, observation] = await getEmptyObservationDataset();
      observation.subject = { name: ["Joe"] };
      expect(observation.subject?.["@id"]).toBeUndefined();
      expect(observation.subject.name).toEqual(["Joe"]);
      expect(
        dataset
          .match(
            namedNode("http://example.com/Observation1"),
            namedNode("http://hl7.org/fhir/subject")
          )
          .toArray()[0].object.termType
      ).toBe("BlankNode");
    });

    it("adds all quads from a set object that includes an array", async () => {
      const [dataset, observation] = await getEmptyObservationDataset();
      const patient: PatientShape = {
        "@id": "http://example.com/Patient1",
        birthdate: "2001-01-01",
        name: ["Jon", "Bon", "Jovi"],
      };
      observation.subject = patient;
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/subject> <http://example.com/Patient1> .\n<http://example.com/Patient1> <http://hl7.org/fhir/birthdate> "2001-01-01"^^<http://www.w3.org/2001/XMLSchema#date> .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Jon" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Bon" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Jovi" .\n'
      );
    });

    it("does not infinitely recurse if there is a loop when setting an object", async () => {
      const [dataset, observation] = await getEmptyObservationDataset();
      const patient1: PatientShape = {
        "@id": "http://example.com/Patient1",
        name: ["jon"],
      };
      const patient2: PatientShape = {
        "@id": "http://example.com/patient2",
        name: ["jane"],
        roommate: [patient1],
      };
      patient1.roommate = [patient2];
      observation.subject = patient1;
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/subject> <http://example.com/Patient1> .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "jon" .\n<http://example.com/Patient1> <http://hl7.org/fhir/roommate> <http://example.com/patient2> .\n<http://example.com/patient2> <http://hl7.org/fhir/name> "jane" .\n<http://example.com/patient2> <http://hl7.org/fhir/roommate> <http://example.com/Patient1> .\n'
      );
    });

    it("sets a primitive on an array", async () => {
      const [dataset, patient] = await getEmptyPatientDataset();
      (patient.name as string[])[0] = "jon";
      expect(dataset.toString()).toBe(
        '<http://example.com/Patient1> <http://hl7.org/fhir/name> "jon" .\n'
      );
    });

    it("sets a primitive on an array and overwrites one that already is there", async () => {
      const [dataset, patient] = await getEmptyPatientDataset();
      dataset.add(
        quad(
          namedNode("http://example.com/Patient1"),
          namedNode("http://hl7.org/fhir/name"),
          literal("jon", "http://www.w3.org/2001/XMLSchema#string")
        )
      );
      (patient.name as string[])[0] = "not jon";
      expect(dataset.toString()).toBe(
        '<http://example.com/Patient1> <http://hl7.org/fhir/name> "not jon" .\n'
      );
    });

    it("sets an array", async () => {
      const [dataset, patient] = await getEmptyPatientDataset();
      patient.name = ["Joe", "Mama"];
      expect(dataset.toString()).toBe(
        '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Joe" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Mama" .\n'
      );
    });

    it("Does not remove the full object when it is replaced on an object", async () => {
      const [dataset, observation] = await getTinyLoadedDataset();
      const replacementPatient: PatientShape = {
        "@id": "http://example.com/ReplacementPatient",
        name: ["Jackson"],
      };
      observation.subject = replacementPatient;
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/subject> <http://example.com/ReplacementPatient> .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/Patient1> <http://hl7.org/fhir/roommate> <http://example.com/Patient2> .\n<http://example.com/Patient2> <http://hl7.org/fhir/name> "Rob" .\n<http://example.com/Patient2> <http://hl7.org/fhir/roommate> <http://example.com/Patient1> .\n<http://example.com/ReplacementPatient> <http://hl7.org/fhir/name> "Jackson" .\n'
      );
    });

    it("Does not remove the full object when it is replaced on an array", async () => {
      const [dataset, observation] = await getTinyLoadedDataset();
      const replacementPatient: PatientShape = {
        "@id": "http://example.com/ReplacementPatient",
        name: ["Jackson"],
      };
      const roommateArr = observation?.subject?.roommate as PatientShape[];
      roommateArr[0] = replacementPatient;
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/subject> <http://example.com/Patient1> .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/Patient1> <http://hl7.org/fhir/roommate> <http://example.com/ReplacementPatient> .\n<http://example.com/Patient2> <http://hl7.org/fhir/name> "Rob" .\n<http://example.com/Patient2> <http://hl7.org/fhir/roommate> <http://example.com/Patient1> .\n<http://example.com/ReplacementPatient> <http://hl7.org/fhir/name> "Jackson" .\n'
      );
    });

    it("Keeps the correct array index when setting an index", async () => {
      const [, observation] = await getLoadedDataset();
      const roommateArr = observation.subject?.roommate as PatientShape[];
      roommateArr[0] = {
        "@id": "http://example.com/ReplacementPatient",
        name: ["Jackson"],
      };
      expect(roommateArr.length).toBe(2);
      expect(roommateArr[0].name?.[0]).toBe("Jackson");
    });

    it("Changes the subject name if the @id is changed", async () => {
      const [dataset, observation] = await getTinyLoadedDataset();
      const patient = observation?.subject as PatientShape;
      patient["@id"] = "http://example.com/RenamedPatient";
      expect(patient["@id"]).toBe("http://example.com/RenamedPatient");
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/subject> <http://example.com/RenamedPatient> .\n<http://example.com/Patient2> <http://hl7.org/fhir/name> "Rob" .\n<http://example.com/Patient2> <http://hl7.org/fhir/roommate> <http://example.com/RenamedPatient> .\n<http://example.com/RenamedPatient> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/RenamedPatient> <http://hl7.org/fhir/roommate> <http://example.com/Patient2> .\n'
      );
    });

    it("Removes all adjoining triples when garbage collection is indicated via the delete operator on an object", async () => {
      const [dataset, observation] = await getTinyLoadedDataset();
      delete observation.subject;
      expect(dataset.toString()).toBe(
        '<http://example.com/Patient2> <http://hl7.org/fhir/name> "Rob" .\n'
      );
    });

    it("Removes all adjoining triples in an array when garbage collection is indicated via the delete operator on an object", async () => {
      const [dataset, observation] = await getTinyLoadedDataset();
      delete observation.subject?.name;
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/subject> <http://example.com/Patient1> .\n<http://example.com/Patient1> <http://hl7.org/fhir/roommate> <http://example.com/Patient2> .\n<http://example.com/Patient2> <http://hl7.org/fhir/name> "Rob" .\n<http://example.com/Patient2> <http://hl7.org/fhir/roommate> <http://example.com/Patient1> .\n'
      );
    });

    it("Removes all adjoining triples when garbage collection is indicated via the delete operator on an array", async () => {
      const [dataset, observation] = await getTinyLoadedDataset();
      delete observation.subject?.roommate?.[0];
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/subject> <http://example.com/Patient1> .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n'
      );
    });

    it("Removes all adjoining triples when garbage collection is indicated via the delete operator on an array with blank nodes", async () => {
      const [dataset, observation] = await getTinyLoadedDatasetWithBlankNodes();
      delete observation.subject?.roommate?.[0];
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/subject> _:b24_Patient1 .\n_:b24_Patient1 <http://hl7.org/fhir/name> "Garrett" .\n'
      );
    });

    it("Removes a literal in an array when using the delete operator", async () => {
      const [dataset, observation] = await getTinyLoadedDataset();
      delete observation.subject?.name?.[0];
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/subject> <http://example.com/Patient1> .\n<http://example.com/Patient1> <http://hl7.org/fhir/roommate> <http://example.com/Patient2> .\n<http://example.com/Patient2> <http://hl7.org/fhir/name> "Rob" .\n<http://example.com/Patient2> <http://hl7.org/fhir/roommate> <http://example.com/Patient1> .\n'
      );
    });

    it("Deletes itself if @id is deleted", async () => {
      const [dataset, observation] = await getTinyLoadedDataset();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete observation["@id"];
      expect(observation).toEqual({ "@id": "http://example.com/Observation1" });
      expect(dataset.toString()).toBe(
        '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/Patient1> <http://hl7.org/fhir/roommate> <http://example.com/Patient2> .\n<http://example.com/Patient2> <http://hl7.org/fhir/name> "Rob" .\n<http://example.com/Patient2> <http://hl7.org/fhir/roommate> <http://example.com/Patient1> .\n'
      );
    });

    it("Does nothing when deleting triples that don't exist", async () => {
      const [dataset, observation] = await getEmptyObservationDataset();
      delete observation.subject;
      expect(dataset.toString()).toBe("");
    });

    it("Does nothing when deleting context", async () => {
      const [, observation] = await getTinyLoadedDataset();
      delete observation["@context"];
      expect(observation["@context"]).toEqual(patientContext);
    });

    it("Does nothing when deleting toString", async () => {
      const [, observation] = await getTinyLoadedDataset();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete observation.toString;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete observation[Symbol.toStringTag];
      expect(typeof observation.toString).toBe("function");
    });

    it("Does nothing when deleting any symbol", async () => {
      const [, observation] = await getTinyLoadedDataset();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete observation[Symbol.search];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(observation[Symbol.search]).toBe(undefined);
    });

    it("Removes old triples from a node that has the same id as the one it replaced", async () => {
      const [dataset, observation] = await getTinyLoadedDataset();
      const replacementPatient: PatientShape = {
        "@id": "http://example.com/Patient1",
        name: ["Mister Sneaky"],
      };
      observation.subject = replacementPatient;
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/subject> <http://example.com/Patient1> .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Mister Sneaky" .\n<http://example.com/Patient2> <http://hl7.org/fhir/name> "Rob" .\n<http://example.com/Patient2> <http://hl7.org/fhir/roommate> <http://example.com/Patient1> .\n'
      );
    });

    it("handles Object.assign", async () => {
      const [dataset, observation] = await getTinyLoadedDataset();
      Object.assign(observation, {
        age: 35,
        isHappy: true,
      });
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/subject> <http://example.com/Patient1> .\n<http://example.com/Observation1> <http://hl7.org/fhir/age> "35"^^<http://www.w3.org/2001/XMLSchema#integer> .\n<http://example.com/Observation1> <http://hl7.org/fhir/isHappy> "true"^^<http://www.w3.org/2001/XMLSchema#boolean> .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/Patient1> <http://hl7.org/fhir/roommate> <http://example.com/Patient2> .\n<http://example.com/Patient2> <http://hl7.org/fhir/name> "Rob" .\n<http://example.com/Patient2> <http://hl7.org/fhir/roommate> <http://example.com/Patient1> .\n'
      );
    });

    it("Adds elements to the array even if they were modified by the datastore", async () => {
      const [dataset, patient] = await getEmptyPatientDataset();
      patient.name = ["Joe", "Blow"];
      dataset.add(
        quad(
          namedNode("http://example.com/Patient1"),
          namedNode("http://hl7.org/fhir/name"),
          literal("Tow")
        )
      );
      expect(patient.name).toEqual(["Joe", "Blow", "Tow"]);
    });

    it("Removes elements from the array even if they were modified by the datastore", async () => {
      const [dataset, patient] = await getEmptyPatientDataset();
      patient.name = ["Joe", "Blow"];
      dataset.delete(
        quad(
          namedNode("http://example.com/Patient1"),
          namedNode("http://hl7.org/fhir/name"),
          literal("Blow")
        )
      );
      expect(patient.name).toEqual(["Joe"]);
    });

    it("Removes and adds from the array even if they were modified by the datastore", async () => {
      const [dataset, patient] = await getEmptyPatientDataset();
      patient.name = ["Joe", "Blow"];
      dataset.delete(
        quad(
          namedNode("http://example.com/Patient1"),
          namedNode("http://hl7.org/fhir/name"),
          literal("Blow")
        )
      );
      dataset.add(
        quad(
          namedNode("http://example.com/Patient1"),
          namedNode("http://hl7.org/fhir/name"),
          literal("Tow")
        )
      );
      expect(patient.name).toEqual(["Joe", "Tow"]);
    });

    it("Prevents duplicates from being added to the array", async () => {
      const [, patient] = await getArrayLoadedDataset();
      const arr = patient.name as string[];
      arr[3] = "Garrett";
      expect(arr).toEqual(["Garrett", "Bobby", "Ferguson"]);
    });

    it("Prevents duplicates from being added when a value is overwritten", async () => {
      const [, patient] = await getArrayLoadedDataset();
      const arr = patient.name as string[];
      arr[1] = "Garrett";
      expect(arr).toEqual(["Garrett", "Ferguson"]);
    });

    it("Prevents duplicates for Objects", async () => {
      const [, observation] = await getLoadedDataset();
      const roommates = observation.subject?.roommate as PatientShape[];
      roommates[0] = { "@id": "http://example.com/Patient3" };
      expect(roommates.length).toBe(1);
      expect(roommates[0].name?.[0]).toBe("Amy");
    });

    it("Does nothing when you try to set a symbol on an array", async () => {
      const [, patient] = await getArrayLoadedDataset();
      const arr = patient.name as string[];
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        arr[Symbol.search] = "Cool";
      }).not.toThrowError();
    });

    it("Does nothing when you try to delete a symbol on an array", async () => {
      const [, patient] = await getArrayLoadedDataset();
      const arr = patient.name as string[];
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete arr[Symbol.search];
      }).not.toThrowError();
    });

    it("Does nothing when you try to delete an index of the array that doesn't exist", async () => {
      const [dataset, patient] = await getArrayLoadedDataset();
      const arr = patient.name as string[];
      delete arr[5];
      expect(arr).toEqual(["Garrett", "Bobby", "Ferguson"]);
      expect(dataset.toString()).toEqual(
        '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Bobby" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Ferguson" .\n'
      );
    });

    it("Can set a triple object named node with just a string", async () => {
      const [dataset, observation] = await getEmptyObservationDataset();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      observation.subject = "http://example.com/Patient1";
      expect(observation.subject).toEqual({
        "@id": "http://example.com/Patient1",
      });
      expect(dataset.toString()).toBe(
        "<http://example.com/Observation1> <http://hl7.org/fhir/subject> <http://example.com/Patient1> .\n"
      );
    });

    describe("Array Methods", () => {
      it("handles copyWithin", async () => {
        const [dataset, patient] = await getArrayLoadedDataset();
        const arr = patient.name as string[];
        arr.copyWithin(0, 2, 3);
        expect(arr).toEqual(["Ferguson", "Bobby"]);
        expect(dataset.toString()).toEqual(
          '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Bobby" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Ferguson" .\n'
        );
      });

      it("handles copyWithin with the optional end variable missing", async () => {
        const [dataset, patient] = await getArrayLoadedDataset();
        const arr = patient.name as string[];
        arr.copyWithin(0, 2);
        expect(arr).toEqual(["Ferguson", "Bobby"]);
        expect(dataset.toString()).toEqual(
          '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Bobby" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Ferguson" .\n'
        );
      });

      it("handles fill", async () => {
        const [dataset, patient] = await getArrayLoadedDataset();
        const arr = patient.name as string[];
        arr.fill("Beepy", 2, 5);
        expect(arr).toEqual(["Garrett", "Bobby", "Beepy"]);
        expect(dataset.toString()).toEqual(
          '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Bobby" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Beepy" .\n'
        );
      });

      it("handles pop", async () => {
        const [dataset, patient] = await getArrayLoadedDataset();
        const arr = patient.name as string[];
        expect(arr.pop()).toBe("Ferguson");
        expect(arr).toEqual(["Garrett", "Bobby"]);
        expect(dataset.toString()).toEqual(
          '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Bobby" .\n'
        );
      });

      it("returns undefined for pop on an empty collection", async () => {
        const [, patient] = await getArrayLoadedDataset();
        patient.name = [];
        expect(patient.name.pop()).toBe(undefined);
      });

      it("handles push", async () => {
        const [dataset, patient] = await getArrayLoadedDataset();
        const arr = patient.name as string[];
        arr.push("Beepy");
        expect(arr).toEqual(["Garrett", "Bobby", "Ferguson", "Beepy"]);
        expect(dataset.toString()).toEqual(
          '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Bobby" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Ferguson" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Beepy" .\n'
        );
      });

      it("handles reverse", async () => {
        const [dataset, patient] = await getArrayLoadedDataset();
        patient.name?.reverse();
        expect(patient.name).toEqual(["Ferguson", "Bobby", "Garrett"]);
        expect(dataset.toString()).toBe(
          '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Bobby" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Ferguson" .\n'
        );
      });

      it("handles shift", async () => {
        const [dataset, patient] = await getArrayLoadedDataset();
        const arr = patient.name as string[];
        expect(arr.shift()).toEqual("Garrett");
        expect(arr).toEqual(["Bobby", "Ferguson"]);
        expect(dataset.toString()).toEqual(
          '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Bobby" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Ferguson" .\n'
        );
      });

      it("returns undefined for shift on an empty collection", async () => {
        const [, patient] = await getArrayLoadedDataset();
        patient.name = [];
        expect(patient.name.shift()).toBe(undefined);
      });

      it("handles sort", async () => {
        const [dataset, patient] = await getArrayLoadedDataset();
        patient.name?.sort((a, b) => {
          return a.length - b.length;
        });
        expect(patient.name).toEqual(["Bobby", "Garrett", "Ferguson"]);
        expect(dataset.toString()).toBe(
          '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Bobby" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Ferguson" .\n'
        );
      });

      it("handles splice", async () => {
        const [dataset, patient] = await getArrayLoadedDataset();
        const arr = patient.name as string[];
        arr.splice(1, 0, "Beepy");
        expect(arr).toEqual(["Garrett", "Beepy", "Bobby", "Ferguson"]);
        expect(dataset.toString()).toEqual(
          '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Bobby" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Ferguson" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Beepy" .\n'
        );
      });

      it("handles splice with objects", async () => {
        const [, observation] = await getLoadedDataset();
        const roommates = observation.subject?.roommate as PatientShape[];
        roommates.splice(
          0,
          1,
          {
            "@id": "http://example.com/Patient4",
            type: { "@id": "Patient" },
            name: ["Dippy"],
            age: 2,
          },
          {
            "@id": "http://example.com/Patient5",
            type: { "@id": "Patient" },
            name: ["Licky"],
            age: 3,
          }
        );
        expect(roommates[0].name?.[0]).toBe("Dippy");
        expect(roommates[1].name?.[0]).toBe("Licky");
        expect(roommates[2].name?.[0]).toBe("Amy");
      });

      it("handles splice with only two params", async () => {
        const [dataset, patient] = await getArrayLoadedDataset();
        const arr = patient.name as string[];
        arr.splice(1, 1);
        expect(arr).toEqual(["Garrett", "Ferguson"]);
        expect(dataset.toString()).toEqual(
          '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Ferguson" .\n'
        );
      });

      it("handles unshift", async () => {
        const [dataset, patient] = await getArrayLoadedDataset();
        const arr = patient.name as string[];
        arr.unshift("Beepy");
        expect(arr).toEqual(["Beepy", "Garrett", "Bobby", "Ferguson"]);
        expect(dataset.toString()).toEqual(
          '<http://example.com/Patient1> <http://hl7.org/fhir/name> "Garrett" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Bobby" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Ferguson" .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "Beepy" .\n'
        );
      });
    });
  });

  describe("underlying data", () => {
    it("retrieves underlying data", async () => {
      const dataset = await serializedToDataset(patientData);
      const entryNode = namedNode("http://example.com/Observation1");
      const context = patientContext;
      const builder = jsonldDatasetProxy(dataset, context);
      const observation = builder.fromSubject(entryNode);
      expect(observation[_getUnderlyingDataset]).toBe(dataset);
      expect(observation[_getUnderlyingNode].value).toBe(
        "http://example.com/Observation1"
      );
      expect(observation[_writeGraphs][0].termType).toBe("DefaultGraph");
      expect(observation[_readGraphs].length).toBe(0);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const roommateArr = observation.subject!.roommate!;
      expect(roommateArr[_getUnderlyingDataset]).toBe(dataset);
      expect(roommateArr[_isSubjectOriented]).toBe(false);
      const match = roommateArr[_getUnderlyingMatch];
      expect(match[0].value).toBe("http://example.com/Patient1");
      expect(match[1].value).toBe("http://hl7.org/fhir/roommate");
    });
  });

  describe("matchSubject", () => {
    let patients: PatientShape[];
    let dataset: Dataset;

    beforeEach(async () => {
      const [receivedDataset, , builder] = await getLoadedDataset();
      dataset = receivedDataset;
      patients = builder.matchSubject<PatientShape>(
        namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        namedNode("http://hl7.org/fhir/Patient")
      );
    });

    it("creates a list of subjects that match a certain pattern", async () => {
      expect(patients[0].name?.[0]).toBe("Garrett");
      expect(patients[1].name?.[0]).toBe("Rob");
      expect(patients[2].name?.[0]).toBe("Amy");
    });

    it("Successfully adds a node to the list", async () => {
      patients.push({
        "@id": "http://example.com/Patient4",
        type: { "@id": "Patient" },
        name: ["Dippy"],
        age: 2,
      });
      expect(
        dataset
          .match(
            null,
            namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            namedNode("http://hl7.org/fhir/Patient")
          )
          .some((quad) => {
            return quad.subject.value === "http://example.com/Patient4";
          })
      ).toBe(true);
      expect(patients[3].name?.[0]).toBe("Dippy");
    });

    it("will read a new object if something has been added to the dataset after object creation", async () => {
      dataset.add(
        quad(
          namedNode("http://example.com/Patient4"),
          namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          namedNode("http://hl7.org/fhir/Patient")
        )
      );
      dataset.add(
        quad(
          namedNode("http://example.com/Patient4"),
          namedNode("http://hl7.org/fhir/name"),
          literal("Dippy")
        )
      );

      expect(
        dataset
          .match(
            null,
            namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            namedNode("http://hl7.org/fhir/Patient")
          )
          .some((quad) => {
            return quad.subject.value === "http://example.com/Patient4";
          })
      ).toBe(true);
      expect(patients[3].name?.[0]).toBe("Dippy");
    });

    it("errors if an object is added without the correct parameters", async () => {
      expect(() =>
        patients.push({
          "@id": "http://example.com/Patient4",
          name: ["Dippy"],
          age: 2,
        })
      ).toThrowError(
        `Cannot add value to collection. This must contain a quad that matches (null, namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://hl7.org/fhir/Patient"), null)`
      );
    });

    it("errors if a literal is added to the collection", async () => {
      // @ts-expect-error Purposely pushing an incorrect value to trigger an error
      expect(() => patients.push("some string")).toThrowError(
        `Cannot add a literal "some string"(string) to a subject-oriented collection.`
      );
    });

    it("Removes all an object and replaces in upon set", async () => {
      patients[0] = {
        "@id": "http://example.com/Patient4",
        type: { "@id": "Patient" },
        name: ["Dippy"],
        age: 2,
      };

      expect(dataset.match(namedNode("http://example.com/Patient1")).size).toBe(
        0
      );
      expect(patients[0].name?.[0]).toBe("Dippy");
    });

    it("Removes an object and replaces it upon splice", async () => {
      patients.splice(
        1,
        1,
        {
          "@id": "http://example.com/Patient4",
          type: { "@id": "Patient" },
          name: ["Dippy"],
          age: 2,
        },
        {
          "@id": "http://example.com/Patient5",
          type: { "@id": "Patient" },
          name: ["Licky"],
          age: 3,
        }
      );

      expect(dataset.match(namedNode("http://example.com/Patient2")).size).toBe(
        0
      );
      expect(patients[1].name?.[0]).toBe("Dippy");
      expect(patients[2].name?.[0]).toBe("Licky");
    });

    it("Removes an object completely when assigning it to undefined", async () => {
      // @ts-expect-error This violates the typings
      patients[0] = undefined;

      expect(dataset.match(namedNode("http://example.com/Patient1")).size).toBe(
        0
      );
      expect(patients[0].name?.[0]).toBe("Rob");
    });

    it("Removes an object completely when using the delete parameter", async () => {
      delete patients[0];

      expect(dataset.match(namedNode("http://example.com/Patient1")).size).toBe(
        0
      );
      expect(patients[0].name?.[0]).toBe("Rob");
    });

    it("creates a collection that matches only collections in a certain graph", async () => {
      const [, , builder] = await getGraphLoadedDataset();
      patients = builder.matchSubject<PatientShape>(
        namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        namedNode("http://hl7.org/fhir/Patient"),
        namedNode("http://example.com/Patient1Doc")
      );
      expect(patients.length).toBe(1);
      expect(patients[0]["@id"]).toBe("http://example.com/Patient1");
    });
  });

  describe("matchObject", () => {
    let patients: PatientShape[];
    let builder: JsonldDatasetProxyBuilder;

    beforeEach(async () => {
      const [, , receivedBuilder] = await getLoadedDataset();
      builder = receivedBuilder;
      patients = builder.matchObject<PatientShape>(
        null,
        namedNode("http://hl7.org/fhir/roommate"),
        null
      );
    });

    it("create a collection that matches the null, predicate, null pattern", async () => {
      expect(patients[0].name?.[0]).toBe("Garrett");
      expect(patients[1].name?.[0]).toBe("Amy");
      expect(patients[2].name?.[0]).toBe("Rob");
    });

    it("cannot write to a collection that matches the null, predicate, null pattern", () => {
      expect(
        () => (patients[1] = { "@id": "http://example.com/Patient4" })
      ).toThrow(
        "A collection that does not specify a match for both a subject or predicate cannot be modified directly."
      );
    });

    it("creates a collection that matches the subject, null, null pattern", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hodgePodge = builder.matchObject<any>(
        namedNode("http://example.com/Patient3"),
        null,
        null
      );
      expect(hodgePodge.length).toBe(5);
      expect(hodgePodge[0]["@id"]).toBe("Patient");
      expect(hodgePodge[1]).toBe("Amy");
      expect(hodgePodge[2]).toBe("1988-01-01");
      expect(hodgePodge[3]).toBe(33);
      expect(hodgePodge[4]).toBe(true);
    });
  });

  describe("fromJson", () => {
    it("initializes a patient using the fromJSON method", async () => {
      const [, , builder] = await getEmptyPatientDataset();
      const patient = builder.fromJson<PatientShape>({
        name: ["Jack", "Horner"],
        birthdate: "1725/11/03",
        age: 298,
        roommate: [
          {
            name: ["Ethical", "Bug"],
          },
        ],
      });
      expect(patient.name?.[0]).toBe("Jack");
      expect(patient.name?.[1]).toBe("Horner");
      expect(patient.birthdate).toBe("1725/11/03");
      expect(patient.age).toBe(298);
      expect(patient.roommate?.[0].name?.[0]).toBe("Ethical");
      expect(patient.roommate?.[0].name?.[1]).toBe("Bug");
    });

    it("initializes a patient using the fromJSON method with a named node", async () => {
      const [, , builder] = await getEmptyPatientDataset();
      const patient = builder.fromJson<PatientShape>({
        "@id": "http://example.com/Patient13",
        name: ["Jack", "Horner"],
        birthdate: "1725/11/03",
        age: 298,
        roommate: [
          {
            name: ["Ethical", "Bug"],
          },
        ],
      });
      expect(patient["@id"]).toBe("http://example.com/Patient13");
      expect(patient.name?.[0]).toBe("Jack");
      expect(patient.name?.[1]).toBe("Horner");
      expect(patient.birthdate).toBe("1725/11/03");
      expect(patient.age).toBe(298);
      expect(patient.roommate?.[0].name?.[0]).toBe("Ethical");
      expect(patient.roommate?.[0].name?.[1]).toBe("Bug");
    });
  });

  describe("Graph Methods", () => {
    it("lets a new patient get created in a new graph", async () => {
      // TODO
      const [dataset, observation, builder] = await getGraphLoadedDataset();
      const patient1Doc = namedNode("http://example.com/patient1Doc");
      const patient2Doc = namedNode("http://example.com/patient2Doc");
      const patient3Doc = namedNode("http://example.com/patient3Doc");
      const patient4Doc = namedNode("http://example.com/patient3Doc");
      const patient1 = observation.subject as PatientShape;
      const patient2 = patient1.roommate?.[0] as PatientShape;
      const patient3 = patient1.roommate?.[1] as PatientShape;

      const patient4 = builder
        .write(patient4Doc)
        .fromSubject<PatientShape>(namedNode("http://example.com/Patient4"));
      patient4.name = ["Licky"];
      patient4.age = 3;
      patient4.roommate = [patient1, patient2, patient3];
      const reset1 = write(patient1Doc).using(patient1);
      patient1.roommate?.push(patient4);
      const reset2 = write(patient2Doc).using(patient2);
      patient2.roommate?.push(patient4);
      const reset3 = write(patient3Doc).using(patient3);
      patient3.roommate?.push(patient4);
      reset1();
      reset2();
      reset3();

      console.log(dataset.toString());

      // let patient4: PatientShape;
      // await write(patient4Doc, async function fancyCallback() {
      //   await new Promise((resolve) => setTimeout(resolve, 10));
      //   patient4 = builder.fromJson<PatientShape>({
      //     name: ["Licky"],
      //     age: 3,
      //     roommate: [patient1, patient2, patient3],
      //   });
      //   await new Promise<void>((resolve) => resolve());
      // });
      // write(patient1Doc, () => patient1.roommate?.push(patient4));
      // write(patient2Doc, () => patient2.roommate?.push(patient4));
      // write(patient3Doc, () => patient3.roommate?.push(patient4));

      // const patient3 = jsonldDatasetProxy<PatientShape>(
      //   dataset,
      //   patientContext,
      //   namedNode("http://example.com/patient3")
      // );
      // patient3.name?.push("Mr. Patient 3");
      // patient3.roommate = [patient1, patient2];
      // // alternatively
      // patient3 = proxyObject<PatientShape>({
      //   name: [""],
      //   roommate: [patient1, patient2],
      // });
      // endGraph();
      // patient1.roommate[patient1Doc].push(patient3);
      // patient3.roommate[patient2Doc].push(patient3);
    });
  });
});
