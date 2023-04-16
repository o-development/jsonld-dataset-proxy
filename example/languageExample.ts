import jsonldDatasetProxy, {
  languagesOf,
  setLanguagePreferences,
} from "../lib";
import { ContextDefinition } from "jsonld";
import { serializedToDataset } from "o-dataset-pack";
import { namedNode } from "@rdfjs/data-model";

async function start() {
  // Define initial data
  const initialData = `
    @prefix example: <http://example.com/> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix ns: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    
    example:Hospital
      rdfs:label "Hospital"^^ns:langString;
      rdfs:label "Hôpital"@fr;
      rdfs:label "병원"@ko;
      rdfs:description "Heals patients"^^ns:langString;
      rdfs:description "Has doctors"^^ns:langString;
      rdfs:description "Guérit les malades"@fr;
      rdfs:description "A des médecins"@fr;
      rdfs:description "환자를 치료하다"@ko;
      rdfs:description "의사 있음"@ko.
  `;
  // Typescript Typing
  interface IThing {
    label: string;
    description: string[];
  }
  // Define JSON-LD Context
  const PersonContext: ContextDefinition = {
    label: {
      "@id": "http://www.w3.org/2000/01/rdf-schema#label",
      "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
    },
    description: {
      "@id": "http://www.w3.org/2000/01/rdf-schema#description",
      "@type": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
      "@container": "@set",
    },
  };

  // Create a dataset loaded with initial data
  const dataset = await serializedToDataset(initialData);
  // Make a JSONLD Dataset Proxy
  const hospitalInfo = jsonldDatasetProxy(dataset, PersonContext)
    .setLanguagePreferences("es", "ko", "@none")
    .fromSubject<IThing>(namedNode("http://example.com/Hospital"));

  console.log(hospitalInfo.label); // Logs "병원"
  console.log(hospitalInfo.description.length); // Logs "2" for the 2 korean entries
  console.log(hospitalInfo.description[0]); // Logs "환자를 치료하다"
  console.log(hospitalInfo.description[1]); // Logs "의사 있음"

  // Adds a string to the description in spanish, because spanish if the first
  // language in the language preference
  hospitalInfo.description.push("Cura a las pacientes");

  // Now that a spanish entry exists, JSON-LD dataset proxy focuses on that
  console.log(hospitalInfo.description.length); // Logs "1" for the 1 spanish entry
  console.log(hospitalInfo.description[0]); // Logs "Cura a las pacientes"

  hospitalInfo.description = [];

  setLanguagePreferences("fr", "ko").using(hospitalInfo);
  console.log(hospitalInfo.label); // Logs "Hôpital"
  setLanguagePreferences("@none").using(hospitalInfo);
  console.log(hospitalInfo.label); // Logs "Hospital"

  const [frenchPreference] =
    setLanguagePreferences("fr").usingCopy(hospitalInfo);
  const [koreanPreference] =
    setLanguagePreferences("ko").usingCopy(hospitalInfo);
  console.log(frenchPreference.label); // Logs "Hôpital"
  console.log(koreanPreference.label); // Logs "병원"

  const labelLanguages = languagesOf(hospitalInfo, "label");
  // labelLanguages: { '@none': 'Hospital', fr: 'Hôpital', ko: '병원' }
  const descriptionLanguages = languagesOf(hospitalInfo, "description");
  // descriptionLanguages:
  // {
  //   '@none': Set(2) { 'Heals patients', 'Has doctors' },
  //   fr: Set(2) { 'Guérit les malades', 'A des médecins' },
  //   ko: Set(2) { '환자를 치료하다', '의사 있음' }
  // }

  // Adds a Chinese label
  labelLanguages.zh = "医院";
  // Changes the no-language label from to "Super Hospital"
  labelLanguages["@none"] = "Super Hospital";
  // Removes the French label
  delete labelLanguages.fr;
  // Adds a Hindi description
  descriptionLanguages.hi?.add("रोगियों को ठीक करता है");
  // Checks to see if the korean label contains "의사 있음"
  descriptionLanguages.ko?.has("의사 있음"); // returns true
  // Removes "Has Doctors" from the no-language description
  descriptionLanguages["@none"]?.delete("Has Doctors");
}

start();
