import type {
  ArrayNode,
  BooleanNode,
  NullNode,
  NumberNode,
  ObjectNode,
  StringNode,
  ValueNode,
} from "@humanwhocodes/momoa";
import { Alias, type Document, type Range, Scalar, YAMLMap, YAMLSeq } from "yaml";

// yaml types are way too generic and allow for silliness; this is a more practical subset
export type YAMLNode = Alias | Scalar | YAMLMap<Scalar, YAMLNode> | YAMLSeq<YAMLNode>;

interface TransformOptions {
  /** Convert YAML range to Momoa Loc */
  transformRange: (range?: Range | null | undefined) => ValueNode["loc"];
  /** YAML document */
  doc: Document;
}

export function transform(node: YAMLNode | null | undefined, { doc, transformRange }: TransformOptions): ValueNode {
  const nullNode: NullNode = {
    type: "Null",
    loc: transformRange(node?.range),
  };

  if (node instanceof YAMLMap) {
    return transformYAMLMap(node, { doc, transformRange });
  }
  if (node instanceof YAMLSeq) {
    return transformYAMLSeq(node, { doc, transformRange });
  }
  if (node instanceof Scalar) {
    return transformScalar(node, { doc, transformRange });
  }
  if (node instanceof Alias) {
    const resolved = node.resolve(doc);
    if (resolved) {
      const cloned = resolved.clone() as YAMLNode;
      // try and use base range. even though it won’t match, it will at least
      // mark the start correctly
      cloned.range = node.range ?? cloned.range;
      return transform(cloned, { doc, transformRange });
    }
    return nullNode;
  }
  return nullNode;
}

export function transformYAMLMap(
  node: YAMLMap<Scalar, YAMLNode>,
  { doc, transformRange }: TransformOptions,
): ObjectNode {
  return {
    type: "Object",
    members: node.items.map((item) => ({
      type: "Member",
      name: transform(item.key, { doc, transformRange }) as StringNode,
      value: transform(item.value, { doc, transformRange }),
      loc: transformRange([item.key.range?.[0] ?? -1, item.value?.range?.[1] ?? -1, item.value?.range?.[2] ?? -1]), // note: the YAML parser doesn’t keep a range on the item itself; use its children instead
    })),
    loc: transformRange(node.range),
  };
}

export function transformYAMLSeq(node: YAMLSeq<YAMLNode>, { doc, transformRange }: TransformOptions): ArrayNode {
  return {
    type: "Array",
    elements: node.items.map((item) => ({
      type: "Element",
      value: transform(item, { doc, transformRange }),
      loc: transformRange(item.range),
    })),
    loc: transformRange(node.range),
  };
}

export function transformScalar(
  node: Scalar,
  { transformRange }: TransformOptions,
): StringNode | BooleanNode | NumberNode | NullNode {
  switch (typeof node.value) {
    case "string": {
      return {
        type: "String",
        value: node.value,
        loc: transformRange(node.range),
      };
    }
    case "boolean": {
      return {
        type: "Boolean",
        value: node.value,
        loc: transformRange(node.range),
      };
    }
    case "number": {
      return {
        type: "Number",
        value: node.value,
        loc: transformRange(node.range),
      };
    }
  }

  if (node.value === null) {
    return {
      type: "Null",
      loc: transformRange(node.range),
    };
  }

  throw new Error(`Unexpected scalar value: ${node.value}`);
}
