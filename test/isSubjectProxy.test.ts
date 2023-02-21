import { getSubjectProxyFromObject, isSubjectProxy } from "../lib";

describe("isSubjectProxy", () => {
  it("returns false if undefined is passed as a parameter", () => {
    expect(isSubjectProxy(undefined)).toBe(false);
  });

  it("throws an error if the given object isn't a subject proxy", () => {
    expect(() => getSubjectProxyFromObject({ cool: "bean" })).toThrowError(
      `[object Object] is not a Jsonld Dataset Proxy`
    );
  });
});
