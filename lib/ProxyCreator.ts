import { BlankNode, NamedNode } from "@rdfjs/types";
import { ArrayProxyTarget, createArrayHandler } from "./createArrayHandler";
import { createSubjectHander, ObjectWithId } from "./createSubjectHandler";
import { ProxyContext } from "./ProxyContext";
import { QuadMatch } from "./QuadMatch";

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
    return `${quadMatch[0]?.value || "undefined"}|${
      quadMatch[1]?.value || "undefined"
    }|${quadMatch[2]?.value || "undefined"}|${
      quadMatch[3]?.value || "undefined"
    }`;
  }

  public createArrayProxy(
    quadMatch: QuadMatch,
    proxyContext: ProxyContext,
    isSubjectOriented = false
  ): ArrayProxyTarget {
    const key = this.getArrayKey(...quadMatch);
    if (!this.arrayMap.has(key)) {
      const proxy = new Proxy(
        [quadMatch, [], isSubjectOriented],
        createArrayHandler(proxyContext)
      );
      this.arrayMap.set(key, proxy);
    }
    return this.arrayMap.get(key) as ArrayProxyTarget;
  }
}
