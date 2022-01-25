import { createDataset } from "o-dataset-pack";
import { jsonldDatasetManipulator } from "../lib/jsonldDatasetManipulator";
import { ObservationShape, patientContext, PatientShape } from "./patientExampleData";
import { namedNode, quad, literal } from "@rdfjs/dataset";

describe("jsonldDatasetManipulator", () => {
  it("sets a primitive value that doesn't exist yet", async () => {
    const dataset = createDataset();
    const observation = await jsonldDatasetManipulator<ObservationShape>(
      dataset,
      patientContext,
      namedNode("https://example.com/observation1")
    );
    observation.notes = "Cool Notes";
    expect(dataset.toString()).toBe(
      '<https://example.com/observation1> <http://hl7.org/fhir/notes> "Cool Notes" .\n'
    );
  });

  it("replaces a primitive value that currently exists", async () => {
    const dataset = createDataset();
    dataset.add(
      quad(
        namedNode("https://example.com/observation1"),
        namedNode("http://hl7.org/fhir/notes"),
        literal("Cool Notes")
      )
    );
    const observation = await jsonldDatasetManipulator<ObservationShape>(
      dataset,
      patientContext,
      namedNode("https://example.com/observation1")
    );
    observation.notes = "Lame Notes";
    expect(dataset.toString()).toBe(
      '<https://example.com/observation1> <http://hl7.org/fhir/notes> "Lame Notes" .\n'
    );
  });

  it("adds all quads from a set object", async () => {
    const dataset = createDataset();
    const observation = await jsonldDatasetManipulator<ObservationShape>(
      dataset,
      patientContext,
      namedNode("https://example.com/observation1")
    );
    const patient: PatientShape = {
      "@id": "https://example.com/patient1",
      name: ["Joey", "Manoey"],
      birthdate: "2001-01-01",
    };
    observation.subject = patient;
    expect(dataset.toString()).toBe("");
  });

  // it("sets a specific array value", () => {});

  // it("pushes to the end of an array", () => {});

  // it("pushes multiple items to the end of the array", () => {});

  // it("removes an item from an array", () => {});

  // it("", () => {});
});
