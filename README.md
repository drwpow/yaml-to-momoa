# yaml-to-momoa

Convert YAML to a [Momoa JSON AST](https://www.npmjs.com/package/@humanwhocodes/momoa).

## Setup

```sh
npm i -D yaml-to-momoa
```

```ts
import yamlToMomoa from "yaml-to-momoa";

const yaml = `object:
  property:
    foo: bar
    bar: 42`;

console.log(yamlToMomoa(yaml)); // DocumentNode
```

You can then traverse the AST just like a momoa node

## Differences from a normal YAML parser

⚠️ This is **NOT** a YAML parser! This just converts YAML to a JSON-like structure. This means that **YAML features not in JSON aren’t supported** (anchors, refs, etc).

- YAML extensions like anchors and references aren’t supported; they’ll just throw a syntax error.
- Comments are supported, and converted to `LineComment` or `BlockComment` appropriately (i.e. parsed as JSONC for Momoa)
- The error handling is minimal. If invalid YAML is passed in, it won’t throw a helpful error. Other libraries will be better for validating YAML than this one.
