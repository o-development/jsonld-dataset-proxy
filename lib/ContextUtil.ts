import { ContextDefinition, ExpandedTermDefinition } from "jsonld";

export class ContextUtil {
  public readonly context: ContextDefinition;
  private iriToKeyMap: Record<string, string>;

  constructor(context: ContextDefinition) {
    this.context = context;
    this.iriToKeyMap = {};
    Object.entries(context).forEach(([contextKey, contextValue]) => {
      if (typeof contextValue === "string") {
        this.iriToKeyMap[contextValue] = contextKey;
      } else if (
        typeof contextValue === "object" &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (contextValue as any)["@id"]
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.iriToKeyMap[(contextValue as any)["@id"]] = contextKey;
      }
    });
  }

  public keyToIri(key: string): string {
    if (!this.context[key]) {
      return key;
    } else if (typeof this.context[key] === "string") {
      return this.context[key] as string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if (this.context[key] && (this.context[key] as any)["@id"]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (this.context[key] as any)["@id"];
    }
    return key;
  }

  public iriToKey(iri: string): string {
    if (this.iriToKeyMap[iri]) {
      return this.iriToKeyMap[iri];
    }
    return iri;
  }

  public getType(key: string): string {
    if (
      typeof this.context[key] === "object" &&
      (this.context[key] as ExpandedTermDefinition)["@type"]
    ) {
      return (this.context[key] as ExpandedTermDefinition)["@type"] as string;
    }
    return "http://www.w3.org/2001/XMLSchema#string";
  }

  public isArray(key: string): boolean {
    return !!(
      this.context[key] &&
      typeof this.context[key] === "object" &&
      (this.context[key] as ExpandedTermDefinition)["@container"] &&
      (this.context[key] as ExpandedTermDefinition)["@container"] === "@set"
    );
  }
}
