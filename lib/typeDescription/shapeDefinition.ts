import { ContextDefinition } from "jsonld";
import { Schema } from "shexj";

// This type only esists to inform the typescript interpreter
// of the type. It is not used in this object.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ShapeDefinition<Type> {
  schema: Schema;
  shapeIri: string;
  context: ContextDefinition;
}
