import { BlankNode, NamedNode } from "@rdfjs/types";
import { createArrayHandler } from "./arrayProxy/createArrayHandler";
import { createSubjectHander } from "./subjectProxy/createSubjectHandler";
import { SubjectProxy } from "./subjectProxy/SubjectProxy";
import { ArrayProxy } from "./arrayProxy/ArrayProxy";
import { ProxyContext, QuadMatch } from "./types";

/**
 * This file keeps track of the target objects used in the proxies.
 * The reason is so that JSON.stringify does not recurse inifinitely
 * when it encounters a circular object.
 */
export class ProxyCreator {
  private subjectMap: Map<string, SubjectProxy> = new Map();
  private arrayMap: Map<string, ArrayProxy> = new Map();

  public createSubjectProxy(
    node: NamedNode | BlankNode,
    proxyContext: ProxyContext
  ): SubjectProxy {
    if (!this.subjectMap.has(node.value)) {
      const proxy = new Proxy(
        { "@id": node },
        createSubjectHander(proxyContext)
      ) as unknown as SubjectProxy;
      this.subjectMap.set(node.value, proxy);
    }
    return this.subjectMap.get(node.value) as SubjectProxy;
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
  ): ArrayProxy {
    const key = this.getArrayKey(...quadMatch);
    if (!this.arrayMap.has(key)) {
      const proxy = new Proxy(
        [quadMatch, [], isSubjectOriented],
        createArrayHandler(proxyContext)
      ) as unknown as ArrayProxy;
      this.arrayMap.set(key, proxy);
    }
    return this.arrayMap.get(key) as ArrayProxy;
  }
}
