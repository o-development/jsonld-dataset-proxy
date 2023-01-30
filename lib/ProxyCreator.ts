import { BlankNode, NamedNode } from "@rdfjs/types";
import {
  ArrayProxyTarget,
  createArrayHandler,
  QuadMatch,
} from "./createArrayHandler";
import { createSubjectHander, ObjectWithId } from "./createSubjectHandler";
import { ProxyContext } from "./ProxyContext";

/**
 * This file keeps track of the target objects used in the proxies.
 * The reason is so that JSON.stringify does not recurse inifinitely
 * when it encounters a circular object.
 */
export class ProxyCreator {
  private subjectMap: Map<string, ObjectWithId> = new Map();
  private arrayMap: Map<string, ArrayProxyTarget> = new Map();

  public createSubjectProxy(
    node: NamedNode | BlankNode,
    proxyContext: ProxyContext
  ): ObjectWithId {
    if (!this.subjectMap.has(node.value)) {
      const proxy = new Proxy(
        { "@id": node },
        createSubjectHander(proxyContext)
      );
      this.subjectMap.set(node.value, proxy);
    }
    return this.subjectMap.get(node.value) as ObjectWithId;
  }

  private getArrayKey(...quadMatch: QuadMatch) {
    return `${quadMatch[0].value}|${quadMatch[1].value}`;
  }

  public createArrayProxy(
    quadMatch: QuadMatch,
    proxyContext: ProxyContext
  ): ArrayProxyTarget {
    const key = this.getArrayKey(...quadMatch);
    if (!this.arrayMap.has(key)) {
      const proxy = new Proxy(
        [quadMatch, []],
        createArrayHandler(proxyContext)
      );
      this.arrayMap.set(key, proxy);
    }
    return this.arrayMap.get(key) as ArrayProxyTarget;
  }
}
