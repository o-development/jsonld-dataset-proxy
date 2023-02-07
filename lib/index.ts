import { jsonldDatasetProxy } from "./jsonldDatasetProxy";

export default jsonldDatasetProxy;
export * from "./types";
export * from "./ContextUtil";
export * from "./ProxyContext";
export * from "./JsonldDatasetProxyBuilder";
export * from "./jsonldDatasetProxy";
export * from "./interact";
export * from "./graphOf";

export * from "./arrayProxy/createArrayHandler";
export * from "./arrayProxy/arrayMethods";
export * from "./arrayProxy/ArrayProxy";
export * from "./arrayProxy/modifyArray";

export * from "./subjectProxy/createSubjectHandler";
export * from "./subjectProxy/SubjectProxy";
export * from "./subjectProxy/getValueForKey";
export * from "./subjectProxy/deleteFromDataset";

export * from "./util/addObjectToDataset";
export * from "./util/objectToJsonRepresentation";
export * from "./util/RawObject";
export * from "./util/getNodeFromRaw";
