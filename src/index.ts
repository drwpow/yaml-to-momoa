import type { AnyNode, DocumentNode } from "@humanwhocodes/momoa";
import { LineCounter, type Range, parseDocument } from "yaml";
import { transform, type YAMLNode } from "./transform.js";

export default function yamlToMomoa(yaml: string, parseOptions?: Parameters<typeof parseDocument>[1]): DocumentNode {
  const doc = parseDocument(yaml, {
    lineCounter: new LineCounter(),
    keepSourceTokens: true,
    ...parseOptions,
  });

  if (doc.errors?.length) {
    for (const error of doc.errors) {
      throw error;
    }
  }
  if (!doc.contents) {
    throw new Error("YAML content null");
  }

  // build sourcemap locations
  const locMap = new Map<number, { line: number; column: number }>();
  let line = 1;
  let column = 0; // this starts at 1, but we increment it before counting
  for (let i = 0; i <= yaml.length; i++) {
    if (yaml[i] === "\n") {
      line++;
      column = 1;
    } else {
      column++;
    }
    locMap.set(i, { line, column });
  }
  function transformRange(range: Range | null | undefined): AnyNode["loc"] {
    let [startOffset, endOffset] = range ?? [-1, 0];
    endOffset--; // endOffset is inclusive, so decrement by 1
    const start = locMap.get(startOffset) ?? { line: -1, column: -1 };
    const end = locMap.get(endOffset) ?? { line: -1, column: -1 };
    return { start: { ...start, offset: startOffset }, end: { ...end, offset: endOffset } };
  }

  // transform
  const body = transform(doc.contents as YAMLNode, {
    doc,
    transformRange,
  });

  const docEnd = locMap.get(yaml.length - 1) ?? { line: -1, column: -1 };
  return {
    type: "Document",
    body,
    loc: { start: { line: 1, column: 1, offset: 0 }, end: { ...docEnd, offset: yaml.length - 1 } },
  };
}
