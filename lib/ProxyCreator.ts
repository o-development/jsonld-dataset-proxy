import { Dataset } from "@rdfjs/types";
import { ContextUtil } from "./ContextUtil";
import { createArrayHandler, QuadMatch } from "./createArrayHandler";
import { createSubjectHander, ObjectWithId } from "./createSubjectHandler";

/**
 * This file keeps track of the target objects used in the proxies.
 * The reason is so that JSON.stringify does not recurse inifinitely
 * when it encounters a circular object.
 */
export class ProxyCreator {
  private subjectMap: Map<string, ObjectWithId> = new Map();
  private arrayMap: Map<string, QuadMatch> = new Map();

  public createSubjectProxy(
    id: string,
    dataset: Dataset,
    contextUtil: ContextUtil
  ) {
    if (!this.subjectMap.has(id)) {
      const proxy = new Proxy(
        { "@id": id },
        createSubjectHander(dataset, contextUtil, this)
      );
      this.subjectMap.set(id, proxy);
    }
    return this.subjectMap.get(id);
  }

  private getArrayKey(...quadMatch: QuadMatch) {
    return `${quadMatch[0]?.value}|${quadMatch[1]?.value}|${quadMatch[2]?.value}|${quadMatch[3]?.value}`;
  }

  public createArrayProxy(
    quadMatch: QuadMatch,
    dataset: Dataset,
    contextUtil: ContextUtil
  ) {
    const key = this.getArrayKey(...quadMatch);
    if (!this.arrayMap.has(key)) {
      const proxy = new Proxy(
        quadMatch,
        createArrayHandler(dataset, contextUtil, this)
      );
      this.arrayMap.set(key, proxy);
    }
    return this.arrayMap.get(key);
  }
}
