import { BlankNode, Dataset, NamedNode } from "@rdfjs/types";
import {
  ArrayProxyTarget,
  createArrayHandler,
} from "./arrayProxy/createArrayHandler";
import { createSubjectHander } from "./subjectProxy/createSubjectHandler";
import { SubjectProxy } from "./subjectProxy/SubjectProxy";
import { ArrayProxy } from "./arrayProxy/ArrayProxy";
import { GraphType, QuadMatch, _getUnderlyingArrayTarget } from "./types";
import { ContextUtil } from "./ContextUtil";

interface ProxyContextOptions {
  dataset: Dataset;
  contextUtil: ContextUtil;
  writeGraphs: GraphType[];
  prefilledArrayTargets?: ArrayProxyTarget[];
}

/**
 * This file keeps track of the target objects used in the proxies.
 * The reason is so that JSON.stringify does not recurse inifinitely
 * when it encounters a circular object.
 */
export class ProxyContext {
  private subjectMap: Map<string, SubjectProxy> = new Map();
  private arrayMap: Map<string, ArrayProxy> = new Map();

  readonly dataset: Dataset;
  readonly contextUtil: ContextUtil;
  readonly writeGraphs: GraphType[];

  constructor(options: ProxyContextOptions) {
    this.dataset = options.dataset;
    this.contextUtil = options.contextUtil;
    this.writeGraphs = options.writeGraphs;
    if (options.prefilledArrayTargets) {
      options.prefilledArrayTargets.forEach((target) => {
        this.createArrayProxy(target[0], target[2], target);
      });
    }
  }

  public createSubjectProxy(node: NamedNode | BlankNode): SubjectProxy {
    if (!this.subjectMap.has(node.value)) {
      const proxy = new Proxy(
        { "@id": node },
        createSubjectHander(this)
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
    isSubjectOriented = false,
    initialTarget?: ArrayProxyTarget
  ): ArrayProxy {
    const key = this.getArrayKey(...quadMatch);
    if (!this.arrayMap.has(key)) {
      const proxy = new Proxy(
        initialTarget || [quadMatch, [], isSubjectOriented],
        createArrayHandler(this)
      ) as unknown as ArrayProxy;
      this.arrayMap.set(key, proxy);
    }
    return this.arrayMap.get(key) as ArrayProxy;
  }

  public duplicate(alternativeOptions: Partial<ProxyContextOptions>) {
    const prefilledArrayTargets: ArrayProxyTarget[] = [];
    this.arrayMap.forEach((value) => {
      prefilledArrayTargets.push(value[_getUnderlyingArrayTarget]);
    });
    const fullOptions: ProxyContextOptions = {
      ...{
        dataset: this.dataset,
        contextUtil: this.contextUtil,
        writeGraphs: this.writeGraphs,
        prefilledArrayTargets,
      },
      ...alternativeOptions,
    };
    return new ProxyContext(fullOptions);
  }
}
