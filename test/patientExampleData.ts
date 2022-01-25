import { ContextDefinition } from "jsonld";

export interface ObservationShape {
  "@id": string;
  subject?: PatientShape;
  notes?: string;
}

export interface PatientShape {
  "@id": string;
  name?: string[];
  birthdate?: string;
}

export const patientContext: ContextDefinition = {
  subject: { "@id": "http://hl7.org/fhir/subject", "@type": "@id" },
  name: { "@id": "http://hl7.org/fhir/name", "@container": "@set" },
  birthdate: {
    "@id": "http://hl7.org/fhir/birthdate",
    "@type": "http://www.w3.org/2001/XMLSchema#date",
  },
  notes: { "@id": "http://hl7.org/fhir/notes" },
};
