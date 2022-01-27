import { createDataset, serializedToDataset } from "o-dataset-pack";
import { jsonldDatasetProxy } from "../lib/jsonldDatasetProxy";
import {
  ObservationShape,
  ObservationShapeDefinition,
  patientData,
  PatientShape,
} from "./patientExampleData";
import { namedNode, quad, literal } from "@rdfjs/dataset";
import { Dataset } from "@rdfjs/types";
import { ShapeDefinition } from "../lib/typeDescription/shapeDefinition";

describe("jsonldDatasetProxy", () => {
  async function getLoadedDataset(): Promise<[Dataset, ObservationShape]> {
    const dataset = await serializedToDataset(patientData);
    const observation = await jsonldDatasetProxy(
      dataset,
      ObservationShapeDefinition,
      namedNode("http://example.com/Observation1")
    );
    return [dataset, observation];
  }

  async function getEmptyDataset(): Promise<[Dataset, ObservationShape]> {
    const dataset = await createDataset();
    const observation = await jsonldDatasetProxy(
      dataset,
      ObservationShapeDefinition,
      namedNode("http://example.com/Observation1")
    );
    return [dataset, observation];
  }

  describe("read", () => {
    it("retreives a primitive", async () => {
      const [, observation] = await getLoadedDataset();
      expect(observation["@id"]).toBe("http://example.com/Observation1");
      expect(observation.notes).toBe("Cool Notes");
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
      const fakePatientShapeDefinition: ShapeDefinition<PatientShape> = {
        schema: { type: "Schema" },
        context: {
          name: {
            "@id": "http://hl7.org/fhir/name",
            "@type": "http://www.w3.org/2001/XMLSchema#string",
          },
        },
        shapeIri: "http://shex.io/webapps/shex.js/doc/PatientShape",
      };
      const patient = await jsonldDatasetProxy(
        dataset,
        fakePatientShapeDefinition,
        namedNode("http://example.com/Patient1")
      );
      expect(patient.name).toEqual(["Garrett", "Bobby", "Ferguson"]);
    });
  });

  describe("write", () => {
    // it("simulates setter object properties", async () => {
    //   const [, observation] = await getLoadedDataset();
    //   const obj = observation.subject as PatientShape;
    //   // obj.assign
    // });
    // it("updates a primitive when the dataset is updated", async () => {});
    // it("updates an array when the dataset is updated", async () => {});
    // it("sets a primitive value that doesn't exist yet", async () => {
    //   const dataset = createDataset();
    //   const observation = await jsonldDatasetProxy<ObservationShape>(
    //     dataset,
    //     patientContext,
    //     namedNode("https://example.com/observation1")
    //   );
    //   observation.notes = "Cool Notes";
    //   expect(dataset.toString()).toBe(
    //     '<https://example.com/observation1> <http://hl7.org/fhir/notes> "Cool Notes" .\n'
    //   );
    // });
    // it("replaces a primitive value that currently exists", async () => {
    //   const dataset = createDataset();
    //   dataset.add(
    //     quad(
    //       namedNode("https://example.com/observation1"),
    //       namedNode("http://hl7.org/fhir/notes"),
    //       literal("Cool Notes")
    //     )
    //   );
    //   const observation = await jsonldDatasetProxy<ObservationShape>(
    //     dataset,
    //     patientContext,
    //     namedNode("https://example.com/observation1")
    //   );
    //   observation.notes = "Lame Notes";
    //   expect(dataset.toString()).toBe(
    //     '<https://example.com/observation1> <http://hl7.org/fhir/notes> "Lame Notes" .\n'
    //   );
    // });
    // it("adds all quads from a set object", async () => {
    //   const dataset = createDataset();
    //   const observation = await jsonldDatasetProxy<ObservationShape>(
    //     dataset,
    //     patientContext,
    //     namedNode("https://example.com/observation1")
    //   );
    //   const patient: PatientShape = {
    //     "@id": "https://example.com/patient1",
    //     birthdate: "2001-01-01",
    //   };
    //   observation.subject = patient;
    //   expect(dataset.toString()).toBe(
    //     '<https://example.com/observation1> <http://hl7.org/fhir/subject> <https://example.com/patient1> .\n<https://example.com/patient1> <http://hl7.org/fhir/birthdate> "2001-01-01"^^<http://www.w3.org/2001/XMLSchema#date> .\n'
    //   );
    // });
    // it("adds all quads from a set object that includes an array", async () => {
    //   const dataset = createDataset();
    //   const observation = await jsonldDatasetProxy<ObservationShape>(
    //     dataset,
    //     patientContext,
    //     namedNode("https://example.com/observation1")
    //   );
    //   const patient: PatientShape = {
    //     "@id": "https://example.com/patient1",
    //     birthdate: "2001-01-01",
    //     name: ["Jon", "Bon", "Jovi"],
    //   };
    //   observation.subject = patient;
    //   expect(dataset.toString()).toBe(
    //     '<https://example.com/observation1> <http://hl7.org/fhir/subject> <https://example.com/patient1> .\n<https://example.com/patient1> <http://hl7.org/fhir/birthdate> "2001-01-01"^^<http://www.w3.org/2001/XMLSchema#date> .\n<https://example.com/patient1> <http://hl7.org/fhir/name> "Jon" .\n<https://example.com/patient1> <http://hl7.org/fhir/name> "Bon" .\n<https://example.com/patient1> <http://hl7.org/fhir/name> "Jovi" .\n'
    //   );
    // });
    // it("does not infinitely recurse if there is a loop when setting an object", async () => {
    //   const dataset = createDataset();
    //   const observation = await jsonldDatasetProxy<ObservationShape>(
    //     dataset,
    //     patientContext,
    //     namedNode("https://example.com/observation1")
    //   );
    //   const patient1: PatientShape = {
    //     "@id": "https://example.com/patient1",
    //     name: ["jon"],
    //   };
    //   const patient2: PatientShape = {
    //     "@id": "https://example.com/patient2",
    //     name: ["jane"],
    //     roommate: [patient1],
    //   };
    //   patient1.roommate = [patient2];
    //   observation.subject = patient1;
    //   expect(dataset.toString()).toBe(
    //     '<https://example.com/observation1> <http://hl7.org/fhir/subject> <https://example.com/patient1> .\n<https://example.com/patient1> <http://hl7.org/fhir/name> "jon" .\n<https://example.com/patient1> <http://hl7.org/fhir/roommate> <https://example.com/patient2> .\n<https://example.com/patient2> <http://hl7.org/fhir/name> "jane" .\n<https://example.com/patient2> <http://hl7.org/fhir/roommate> <https://example.com/patient1> .\n'
    //   );
    // });
    // it("Removes triples from an overwritten object", () => {
    // })
    // it("sets a specific array value", () => {
    //   const dataset = createDataset();
    //   dataset.addAll([
    //     quad(
    //       namedNode("https://example.com/patient1"),
    //       namedNode("http://hl7.org/fhir/roommate"),
    //       namedNode("https://example.com/patient2")
    //     ),
    //     quad(
    //       namedNode("https://example.com/patient1"),
    //       namedNode("http://hl7.org/fhir/roommate"),
    //       namedNode("https://example.com/patient3")
    //     ),
    //   ]);
    //   const observation = await jsonldDatasetManipulator<ObservationShape>(
    //     dataset,
    //     patientContext,
    //     namedNode("https://example.com/observation1")
    //   );
    // });
    // it("pushes to the end of an array", () => {});
    // it("pushes multiple items to the end of the array", () => {});
    // it("removes an item from an array", () => {});
    // it("simulates setter behaviour of an array of primitives", async () => {
    //   const [, observation] = await getLoadedDataset();
    //   const arr = observation?.subject?.name as string[];
    //   // arr.copyWithin
    //   // arr.fill
    //   // arr.pop
    //   // arr.push
    //   // arr.shift
    //   // arr.sort
    //   // arr.splice
    //   // arr.unshift
    // });
  });
});
