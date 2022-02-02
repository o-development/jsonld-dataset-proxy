import { ContextDefinition } from "jsonld";
import { Schema } from "shexj";

export type ObservationShape = {
  "@id"?: string;
  "@context"?: ContextDefinition;
  subject?: PatientShape;
  notes?: string;
};

export type PatientShape = {
  "@id"?: string;
  "@context"?: ContextDefinition;
  name?: string[];
  birthdate?: string;
  age?: number;
  isHappy?: boolean;
  roommate?: PatientShape[];
};

export const patientSchema: Schema = {
  type: "Schema",
  start: "http://shex.io/webapps/shex.js/doc/ObservationShape",
  shapes: [
    {
      type: "Shape",
      id: "http://shex.io/webapps/shex.js/doc/ObservationShape",
      expression: {
        type: "EachOf",
        expressions: [
          {
            type: "TripleConstraint",
            predicate: "http://hl7.org/fhir/subject",
            valueExpr: "http://shex.io/webapps/shex.js/doc/PatientShape",
            min: 0,
            max: 1,
          },
          {
            type: "TripleConstraint",
            predicate: "http://hl7.org/fhir/notes",
            valueExpr: {
              type: "NodeConstraint",
              datatype: "http://www.w3.org/2001/XMLSchema#string",
            },
            min: 0,
            max: 1,
          },
        ],
      },
    },
    {
      type: "Shape",
      id: "http://shex.io/webapps/shex.js/doc/PatientShape",
      expression: {
        type: "EachOf",
        expressions: [
          {
            type: "TripleConstraint",
            predicate: "http://hl7.org/fhir/name",
            valueExpr: {
              type: "NodeConstraint",
              datatype: "http://www.w3.org/2001/XMLSchema#string",
            },
            min: 0,
            max: -1,
          },
          {
            type: "TripleConstraint",
            predicate: "http://hl7.org/fhir/birthdate",
            valueExpr: {
              type: "NodeConstraint",
              datatype: "http://www.w3.org/2001/XMLSchema#date",
            },
            min: 0,
            max: 1,
          },
          {
            type: "TripleConstraint",
            predicate: "http://hl7.org/fhir/age",
            valueExpr: {
              type: "NodeConstraint",
              datatype: "http://www.w3.org/2001/XMLSchema#integer",
            },
            min: 0,
            max: 1,
          },
          {
            type: "TripleConstraint",
            predicate: "http://hl7.org/fhir/isHappy",
            valueExpr: {
              type: "NodeConstraint",
              datatype: "http://www.w3.org/2001/XMLSchema#boolean",
            },
            min: 0,
            max: 1,
          },
          {
            type: "TripleConstraint",
            predicate: "http://hl7.org/fhir/roommate",
            valueExpr: "http://shex.io/webapps/shex.js/doc/PatientShape",
            min: 0,
            max: -1,
          },
        ],
      },
    },
  ],
  "@context": "http://www.w3.org/ns/shex.jsonld",
};

export const patientContext: ContextDefinition = {
  subject: { "@id": "http://hl7.org/fhir/subject", "@type": "@id" },
  name: {
    "@id": "http://hl7.org/fhir/name",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@container": "@set",
  },
  birthdate: {
    "@id": "http://hl7.org/fhir/birthdate",
    "@type": "http://www.w3.org/2001/XMLSchema#date",
  },
  age: {
    "@id": "http://hl7.org/fhir/age",
    "@type": "http://www.w3.org/2001/XMLSchema#integer",
  },
  isHappy: {
    "@id": "http://hl7.org/fhir/isHappy",
    "@type": "http://www.w3.org/2001/XMLSchema#boolean",
  },
  roommate: {
    "@id": "http://hl7.org/fhir/roommate",
    "@type": "@id",
    "@container": "@set",
  },
  notes: {
    "@id": "http://hl7.org/fhir/notes",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
};

export const patientData = `
@prefix example: <http://example.com/> .
@prefix fhir: <http://hl7.org/fhir/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

example:Observation1
  fhir:notes "Cool Notes"^^xsd:string ;
  fhir:subject example:Patient1 .

example:Patient1
  fhir:name "Garrett"^^xsd:string,  "Bobby"^^xsd:string, "Ferguson"^^xsd:string ;
  fhir:birthdate "1986-01-01"^^xsd:date ;
  fhir:age "35"^^xsd:integer ;
  fhir:isHappy "true"^^xsd:boolean ;
  fhir:roommate example:Patient2, example:Patient3 .

example:Patient2
  fhir:name "Rob"^^xsd:string ;
  fhir:birthdate "1987-01-01"^^xsd:date ;
  fhir:age "34"^^xsd:integer ;
  fhir:isHappy "false"^^xsd:boolean ;
  fhir:roommate example:Patient1, example:Patient3 .

example:Patient3
  fhir:name "Amy"^^xsd:string ;
  fhir:birthdate "1988-01-01"^^xsd:date ;
  fhir:age "33"^^xsd:integer ;
  fhir:isHappy "true"^^xsd:boolean .
`;

export const patientDataWithBlankNodes = `
@prefix example: <http://example.com/> .
@prefix fhir: <http://hl7.org/fhir/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

example:Observation1
  fhir:notes "Cool Notes"^^xsd:string ;
  fhir:subject _:Patient1 .

_:Patient1
  fhir:name "Garrett"^^xsd:string,  "Bobby"^^xsd:string, "Ferguson"^^xsd:string ;
  fhir:birthdate "1986-01-01"^^xsd:date ;
  fhir:age "35"^^xsd:integer ;
  fhir:isHappy "true"^^xsd:boolean ;
  fhir:roommate _:Patient2, _:Patient3 .

_:Patient2
  fhir:name "Rob"^^xsd:string ;
  fhir:birthdate "1987-01-01"^^xsd:date ;
  fhir:age "34"^^xsd:integer ;
  fhir:isHappy "false"^^xsd:boolean ;
  fhir:roommate _:Patient1, _:Patient3 .

_:Patient3
  fhir:name "Amy"^^xsd:string ;
  fhir:birthdate "1988-01-01"^^xsd:date ;
  fhir:age "33"^^xsd:integer ;
  fhir:isHappy "true"^^xsd:boolean .
`;

export const tinyPatientData = `
@prefix example: <http://example.com/> .
@prefix fhir: <http://hl7.org/fhir/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

example:Observation1
  fhir:subject example:Patient1 .

example:Patient1
  fhir:name "Garrett"^^xsd:string ;
  fhir:roommate example:Patient2 .

example:Patient2
  fhir:name "Rob"^^xsd:string ;
  fhir:roommate example:Patient1 .
`;

export const tinyArrayPatientData = `
@prefix example: <http://example.com/> .
@prefix fhir: <http://hl7.org/fhir/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

example:Patient1
  fhir:name "Garrett"^^xsd:string,  "Bobby"^^xsd:string, "Ferguson"^^xsd:string .
`;

export const tinyPatientDataWithBlankNodes = `
@prefix example: <http://example.com/> .
@prefix fhir: <http://hl7.org/fhir/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

example:Observation1
  fhir:subject _:Patient1 .

_:Patient1
  fhir:name "Garrett"^^xsd:string ;
  fhir:roommate _:Patient2 .

_:Patient2
  fhir:name "Rob"^^xsd:string ;
  fhir:roommate _:Patient1 .
`;
