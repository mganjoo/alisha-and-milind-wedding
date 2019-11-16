import { range, makeIdMap, filterNonEmptyKeys } from "./Utils"
import shortid from "shortid"

describe("Utils", () => {
  describe("makeIdMap()", () => {
    it("should generate a correct map of IDs to values", () => {
      const map1 = makeIdMap(["lorem", "ipsum", "dolor"], s => `${s} foo`)
      Object.keys(map1).every(shortid.isValid)
      expect(Object.values(map1)).toEqual([
        "lorem foo",
        "ipsum foo",
        "dolor foo",
      ])
    })
  })
  describe("range()", () => {
    it("should generate ranges correctly", () => {
      expect(range(4)).toEqual([0, 1, 2, 3])
      expect(range(0)).toEqual([])
      expect(range(1)).toEqual([0])
    })
  })
  describe("filterNonEmptyKeys()", () => {
    it("should filter empty values correctly", () => {
      expect(filterNonEmptyKeys({ a: "foo", b: "", c: "  " })).toEqual(["a"])
    })
  })
})
