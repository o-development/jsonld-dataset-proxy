import { GraphType, ObjectLike } from "./types";

interface InteractOptions {
  using(...objects: ObjectLike[]): () => void;
  usingCopy<T extends ObjectLike>(...objects: T[]): T[];
}

export function write(...graphs: GraphType[]): InteractOptions {
  return {
    using(...objects: ObjectLike[]): () => void {
      throw new Error("Not Implemented");
    },
    usingCopy<T extends ObjectLike>(...objects: T[]): T[] {
      throw new Error("Not Implemented");
    },
  };
}

export function read(...graphs: GraphType[]): InteractOptions {
  return {
    using(...objects: ObjectLike[]): () => void {
      throw new Error("Not Implemented");
    },
    usingCopy<T extends ObjectLike>(...objects: T[]): T[] {
      throw new Error("Not Implemented");
    },
  };
}

export function interact(...graphs: GraphType[]): InteractOptions {
  return {
    using(...objects: ObjectLike[]): () => void {
      throw new Error("Not Implemented");
    },
    usingCopy<T extends ObjectLike>(...objects: T[]): T[] {
      throw new Error("Not Implemented");
    },
  };
}
