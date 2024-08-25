# yaml-to-momoa

Convert YAML to a [Momoa JSON AST](https://www.npmjs.com/package/@humanwhocodes/momoa). Powered by [yaml](https://eemeli.org/yaml).

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

const ast = yamlToMomoa(yaml);

console.log(ast); // DocumentNode
```

You can then traverse the AST just like a Momoa node.

## FAQ

#### Why would I need this?

If you have some project using JSON and you’re using Momoa, and want to add YAML support. If you aren’t using Momoa, you don’t need this.

#### Can this convert Momoa AST to YAML AST?

No.

## Gotchas

- This preserves original locations (lines and columns) as best it can, but since YAML ↔ JSON syntax isn’t 1:1, this will result in “impossible” locations (the lines and columns won’t ever match up to any JSON source, since they came from YAML).
- Since `yaml` is doing the parsing, all YAML features are supported, but superset features have to make some concessions to map to a JSON structure. For example, references (`&[id]`) will all get expanded as if they were duplicated in the original file.
  - Situations like this will lead to some interesting sourcemap locations, to the first point
