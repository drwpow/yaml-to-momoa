import type { DocumentNode } from "@humanwhocodes/momoa";

export default function parse(yaml: string): DocumentNode {
  // check errors
  if (typeof yaml !== "string") {
    throw new Error("YAML must be in string form");
  }

  return {
    type: "Document",
    body: [],
  };
}
