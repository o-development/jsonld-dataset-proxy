import { Dataset } from "@rdfjs/types";
import { ContextUtil } from "./ContextUtil";
import { ProxyCreator } from "./ProxyCreator";

export interface ProxyContext {
  dataset: Dataset;
  contextUtil: ContextUtil;
  proxyCreator: ProxyCreator;
}
