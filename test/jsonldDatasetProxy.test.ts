import { createDataset, serializedToDataset } from "o-dataset-pack";
import { jsonldDatasetProxy, JsonldDatasetProxy } from "../lib";
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
import { Dataset } from "@rdfjs/types";
import { ContextDefinition } from "jsonld";

describe("jsonldDatasetProxy", () => {
  async function getLoadedDataset(): Promise<[Dataset, ObservationShape]> {
    const dataset = await serializedToDataset(patientData);
    const observation = await jsonldDatasetProxy<ObservationShape>(
      dataset,
      patientContext,
      namedNode("http://example.com/Observation1")
    );
    return [dataset, observation];
  }

  async function getLoadedDatasetWithBlankNodes(): Promise<
    [Dataset, ObservationShape]
  > {
    const dataset = await serializedToDataset(patientDataWithBlankNodes);
    const observation = await jsonldDatasetProxy<ObservationShape>(
      dataset,
      patientContext,
      namedNode("http://example.com/Observation1")
    );
    return [dataset, observation];
  }

  async function getTinyLoadedDataset(): Promise<[Dataset, ObservationShape]> {
    const dataset = await serializedToDataset(tinyPatientData);
    const observation = await jsonldDatasetProxy<ObservationShape>(
      dataset,
      patientContext,
      namedNode("http://example.com/Observation1")
    );
    return [dataset, observation];
  }

  async function getTinyLoadedDatasetWithBlankNodes(): Promise<
    [Dataset, ObservationShape]
  > {
    const dataset = await serializedToDataset(tinyPatientDataWithBlankNodes);
    const observation = await jsonldDatasetProxy<ObservationShape>(
      dataset,
      patientContext,
      namedNode("http://example.com/Observation1")
    );
    return [dataset, observation];
  }

  async function getArrayLoadedDataset(): Promise<[Dataset, PatientShape]> {
    const dataset = await serializedToDataset(tinyArrayPatientData);
    const patient = await jsonldDatasetProxy<PatientShape>(
      dataset,
      patientContext,
      namedNode("http://example.com/Patient1")
    );
    return [dataset, patient];
  }

  async function getEmptyObservationDataset(): Promise<
    [Dataset, ObservationShape]
  > {
    const dataset = await createDataset();
    const observation = await jsonldDatasetProxy<ObservationShape>(
      dataset,
      patientContext,
      namedNode("http://example.com/Observation1")
    );
    return [dataset, observation];
  }

  async function getEmptyPatientDataset(): Promise<[Dataset, PatientShape]> {
    const dataset = await createDataset();
    const observation = await jsonldDatasetProxy<PatientShape>(
      dataset,
      patientContext,
      namedNode("http://example.com/Patient1")
    );
    return [dataset, observation];
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
      const obj = observation.subject as JsonldDatasetProxy<PatientShape>;

      expect(obj["@id"]).toEqual("http://example.com/Patient1");
      expect(obj.name).toEqual(["Garrett", "Bobby", "Ferguson"]);
      expect(obj.birthdate).toEqual("1986-01-01");
      expect(obj.age).toEqual(35);
      expect(obj.isHappy).toEqual(true);
      const entries = Object.entries(obj);
      expect(entries[0]).toEqual(["@id", "http://example.com/Patient1"]);
      expect(entries[1]).toEqual(["name", ["Garrett", "Bobby", "Ferguson"]]);
      expect(entries[2]).toEqual(["birthdate", "1986-01-01"]);
      expect(entries[3]).toEqual(["age", 35]);
      expect(entries[4]).toEqual(["isHappy", true]);
      expect(entries[5][0]).toEqual("roommate");
      expect(Object.keys(obj)).toEqual([
        "@id",
        "name",
        "birthdate",
        "age",
        "isHappy",
        "roommate",
      ]);
      const values = Object.values(obj);
      expect(values[0]).toEqual("http://example.com/Patient1");
      expect(values[1]).toEqual(["Garrett", "Bobby", "Ferguson"]);
      expect(values[2]).toEqual("1986-01-01");
      expect(values[3]).toEqual(35);
      expect(values[4]).toEqual(true);
    });

    it("handles stringification of a non circular object", async () => {
      const [, observation] = await getLoadedDataset();
      const obj = observation.subject?.roommate?.[1] as PatientShape;
      expect(obj.toString()).toBe("[object Object]");
      expect(JSON.stringify(obj)).toBe(
        `{"@id":"http://example.com/Patient3","name":["Amy"],"birthdate":"1988-01-01","age":33,"isHappy":true}`
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
      const patient = await jsonldDatasetProxy<PatientShape>(
        dataset,
        fakePatientSContext,
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
        "@id": "https://example.com/patient2",
        name: ["jane"],
        roommate: [patient1],
      };
      patient1.roommate = [patient2];
      observation.subject = patient1;
      expect(dataset.toString()).toBe(
        '<http://example.com/Observation1> <http://hl7.org/fhir/subject> <http://example.com/Patient1> .\n<http://example.com/Patient1> <http://hl7.org/fhir/name> "jon" .\n<http://example.com/Patient1> <http://hl7.org/fhir/roommate> <https://example.com/patient2> .\n<https://example.com/patient2> <http://hl7.org/fhir/name> "jane" .\n<https://example.com/patient2> <http://hl7.org/fhir/roommate> <http://example.com/Patient1> .\n'
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
});
