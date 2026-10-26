import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const source = ts.transpileModule(
  readFileSync(new URL("../app/utils/comparison.ts", import.meta.url), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }
).outputText;
const { unitPrice, comparison } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);
const item = { price: 100, volume: 500, qty: 1, unit: "g" };
test("grams and kilograms use the same price per 100 g, including ties", () => {
  assert.equal(unitPrice(item), 20);
  assert.equal(unitPrice({ ...item, volume: 0.5, unit: "kg" }), 20);
  assert.equal(
    comparison([item, { ...item, volume: 0.5, unit: "kg" }]).cheapest,
    20
  );
});
test("millilitres and litres use the same price per 100 ml", () => {
  assert.equal(
    unitPrice({ ...item, unit: "ml" }),
    unitPrice({ ...item, volume: 0.5, unit: "l" })
  );
});
test("shipping and pack quantity are included before unit normalization", () => {
  assert.equal(
    unitPrice({ price: 100, shipping: 20, volume: 0.5, qty: 2, unit: "kg" }),
    12
  );
});
test("counts and legacy entries without units retain their per-item calculation", () => {
  assert.equal(unitPrice({ price: 60, volume: 2, qty: 3 }), 10);
  assert.equal(unitPrice({ price: 60, volume: 2, qty: 3, unit: "item" }), 10);
});
test("mixed dimensions never receive a lowest-price ranking", () => {
  for (const unit of ["ml", "item"]) {
    assert.deepEqual(comparison([item, { ...item, unit }]), {
      count: 2,
      incompatible: true,
      cheapest: undefined,
    });
  }
});
test("unknown units, invalid numbers, zero and negative inputs cannot win", () => {
  for (const change of [
    { unit: "oz" },
    { price: 0 },
    { price: -2 },
    { volume: 0 },
    { qty: 0 },
    { shipping: -1 },
    { price: Infinity },
    { price: "" },
  ]) {
    assert.equal(unitPrice({ ...item, ...change }), undefined);
  }
  assert.equal(
    comparison([item, { ...item, price: undefined }]).cheapest,
    undefined
  );
});
