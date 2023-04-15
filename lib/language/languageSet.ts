import { Dataset, Literal } from "@rdfjs/types";
import { PredicateType, SubjectType } from "../types";
import { LanguageKey } from "./languageTypes";
import {
  LiteralObjectQuad,
  languageDeleteMatch,
  languageMatch,
} from "./languageUtils";
import { literal, quad } from "@rdfjs/data-model";
import { ProxyContext } from "../ProxyContext";

export default class LanguageSet implements Set<string> {
  private subject: SubjectType;
  private predicate: PredicateType;
  private languageKey: LanguageKey;
  private proxyContext: ProxyContext;

  constructor(
    subject: SubjectType,
    predicate: PredicateType,
    languageKey: LanguageKey,
    proxyContext: ProxyContext
  ) {
    this.subject = subject;
    this.predicate = predicate;
    this.languageKey = languageKey;
    this.proxyContext = proxyContext;
  }

  private matchThis(): Dataset<LiteralObjectQuad> {
    return languageMatch(
      this.proxyContext.dataset,
      this.subject,
      this.predicate,
      this.languageKey
    );
  }

  private getLiteral(value: string): Literal {
    return this.languageKey === "@none"
      ? literal(value)
      : literal(value, this.languageKey);
  }

  public get size(): number {
    return this.matchThis().size;
  }

  add(value: string): this {
    this.proxyContext.writeGraphs.forEach((graph) => {
      this.proxyContext.dataset.add(
        quad(
          this.subject,
          this.predicate,
          literal(value, this.languageKey),
          graph
        )
      );
    });
    return this;
  }

  clear(): void {
    languageDeleteMatch(
      this.proxyContext.dataset,
      this.subject,
      this.predicate,
      this.languageKey
    );
  }

  delete(value: string): boolean {
    const hadValue = this.has(value);
    this.proxyContext.dataset.deleteMatches(
      this.subject,
      this.predicate,
      this.getLiteral(value)
    );
    return hadValue;
  }

  forEach(
    callbackfn: (value: string, value2: string, set: Set<string>) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thisArg?: any
  ): void {
    const quads = this.matchThis();
    quads.forEach((curQuad) => {
      callbackfn(curQuad.object.value, curQuad.object.value, thisArg || this);
    });
  }

  has(item: string): boolean {
    return (
      this.proxyContext.dataset.match(
        this.subject,
        this.predicate,
        this.getLiteral(item)
      ).size > 0
    );
  }

  *entries(): IterableIterator<[string, string]> {
    const quads = this.matchThis();
    for (const curQuad of quads) {
      yield [curQuad.object.value, curQuad.object.value];
    }
  }

  *keys(): IterableIterator<string> {
    const quads = this.matchThis();
    for (const curQuad of quads) {
      yield curQuad.object.value;
    }
  }

  *values(): IterableIterator<string> {
    const quads = this.matchThis();
    for (const curQuad of quads) {
      yield curQuad.object.value;
    }
  }

  *[Symbol.iterator](): IterableIterator<string> {
    const quads = this.matchThis();
    for (const curQuad of quads) {
      yield curQuad.object.value;
    }
  }

  [Symbol.toStringTag] = "LanguageSet";
}
