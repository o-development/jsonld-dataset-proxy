import { GraphType, ObjectLike } from "./types";

interface InteractOptions {
  using(...objects: ObjectLike[]): () => void;
  usingCopy<T extends ObjectLike>(...objects: T[]): T[];
}

export function write(..._graphs: GraphType[]): InteractOptions {
  return {
    using(..._objects: ObjectLike[]): () => void {
      throw new Error("Not Implemented");
    },
    usingCopy<T extends ObjectLike>(..._objects: T[]): T[] {
      throw new Error("Not Implemented");
    },
  };
}

export function read(..._graphs: GraphType[]): InteractOptions {
  return {
    using(..._objects: ObjectLike[]): () => void {
      throw new Error("Not Implemented");
    },
    usingCopy<T extends ObjectLike>(..._objects: T[]): T[] {
      throw new Error("Not Implemented");
    },
  };
}

export function interact(..._graphs: GraphType[]): InteractOptions {
  return {
    using(..._objects: ObjectLike[]): () => void {
      throw new Error("Not Implemented");
    },
    usingCopy<T extends ObjectLike>(..._objects: T[]): T[] {
      throw new Error("Not Implemented");
    },
  };
}
