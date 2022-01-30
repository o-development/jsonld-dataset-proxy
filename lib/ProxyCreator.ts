import { BlankNode, Dataset, NamedNode } from "@rdfjs/types";
import { ContextUtil } from "./ContextUtil";
import {
  ArrayProxyTarget,
  createArrayHandler,
  QuadMatch,
} from "./createArrayHandler";
import { createSubjectHander, ObjectWithId } from "./createSubjectHandler";

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
    dataset: Dataset,
    contextUtil: ContextUtil
  ): ObjectWithId {
    if (!this.subjectMap.has(node.value)) {
      const proxy = new Proxy(
        { "@id": node },
        createSubjectHander(dataset, contextUtil, this)
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
    dataset: Dataset,
    contextUtil: ContextUtil
  ): ArrayProxyTarget {
    const key = this.getArrayKey(...quadMatch);
    if (!this.arrayMap.has(key)) {
      const proxy = new Proxy(
        [quadMatch, []],
        createArrayHandler(dataset, contextUtil, this)
      );
      this.arrayMap.set(key, proxy);
    }
    return this.arrayMap.get(key) as ArrayProxyTarget;
  }
}
