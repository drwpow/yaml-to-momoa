import { parse } from "@humanwhocodes/momoa";
import { describe, expect, test } from "vitest";
import yamlToMomoa from "./index.js";

describe("yamlToMomoa", () => {
  test("types", () => {
    expect(
      yamlToMomoa(`yaml:
  # String
  string-literal: string
  string-double-quotes: "string"
  string-single-quotes: 'string'
  string-block: |
    string
    foo: true
  string-boolean-like: tRue
  string-number-like: "42"
  string-boolean-like-2: "Y"
  string-escaped-quotes: "string \\"quote\\" odd?\\" '"

  # Boolean
  boolean-true: true
  boolean-true-2: True
  boolean-true-3: TRUE
  boolean-false: false
  boolean-false-2: False
  boolean-false-3: FALSE
  boolean-y: y
  boolean-y-2: Y
  boolean-yes: yes
  boolean-yes-2: Yes
  boolean-yes-3: YES
  boolean-n: n
  boolean-n-2: N
  boolean-no: no
  boolean-no-2: No
  boolean-no-3: NO
  boolean-on: on
  boolean-on-2: On
  boolean-on-3: ON
  boolean-off: off
  boolean-off-2: Off
  boolean-off-3: OFF

  # Number
  number-int: 42
  number-float: 42.42
  number-no-zero: .423

  # Null
  null: null

  # Objects
  object:
     property:
       foo: bar
  object-inline: { property: { foo: bar } }

  # Arrays
  array:
    - foo
    - bar
  array-inline: [foo, bar]
  array-of-objects:
    - foo: bar
    - baz: qux
      nested-array:
        - foo: bar
          nested-array-inline: [foo, bar]
  array-of-objects-inline: [{ foo: bar }, { baz: qux }]

  # Commented code
  # foo: bar
  # - baz: qux`),
    ).toEqual(parse(""));
  });

  describe("errors", () => {
    test("throws error if input isn’t string", () => {
      expect(() =>
        yamlToMomoa(
          // @ts-expect-error
          Buffer.from("yaml: true", "utf8"),
        ),
      ).toThrowError("YAML must be in string form");
    });
  });
});
