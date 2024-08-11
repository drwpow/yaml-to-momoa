import fs from "node:fs";
import os from "node:os";
import { fileURLToPath } from "node:url";
import type { DocumentNode } from "@humanwhocodes/momoa";
import { describe, expect, test } from "vitest";
import yamlToMomoa from "../index.js";

describe("yamlToMomoa", () => {
  const tests: [string, { yaml: string; momoa: DocumentNode; parseOptions?: Parameters<typeof yamlToMomoa>[1] }][] = [
    [
      "string",
      {
        yaml: "string: string",
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "string",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 6, offset: 5 } },
                },
                value: {
                  type: "String",
                  value: "string",
                  loc: { start: { line: 1, column: 9, offset: 8 }, end: { line: 1, column: 14, offset: 13 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 14, offset: 13 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 14, offset: 13 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 14, offset: 13 } },
        },
      },
    ],
    [
      "string (block)",
      {
        yaml: `string: |
  string
  foo: true
    indented`,
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "string",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 6, offset: 5 } },
                },
                value: {
                  type: "String",
                  value: "string\nfoo: true\n  indented\n",
                  loc: { start: { line: 1, column: 9, offset: 8 }, end: { line: 4, column: 13, offset: 42 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 4, column: 13, offset: 42 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 4, column: 13, offset: 42 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 4, column: 13, offset: 42 } },
        },
      },
    ],
    [
      "string (boolean-like)",
      {
        yaml: "string: tRue",
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "string",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 6, offset: 5 } },
                },
                value: {
                  type: "String",
                  value: "tRue",
                  loc: { start: { line: 1, column: 9, offset: 8 }, end: { line: 1, column: 12, offset: 11 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 12, offset: 11 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 12, offset: 11 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 12, offset: 11 } },
        },
      },
    ],
    [
      "string (number-like)",
      {
        yaml: 'string: "42"',
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "string",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 6, offset: 5 } },
                },
                value: {
                  type: "String",
                  value: "42",
                  loc: { start: { line: 1, column: 9, offset: 8 }, end: { line: 1, column: 12, offset: 11 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 12, offset: 11 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 12, offset: 11 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 12, offset: 11 } },
        },
      },
    ],
    [
      "boolean (true)",
      {
        yaml: "boolean: true",
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "boolean",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 7, offset: 6 } },
                },
                value: {
                  type: "Boolean",
                  value: true,
                  loc: { start: { line: 1, column: 10, offset: 9 }, end: { line: 1, column: 13, offset: 12 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 13, offset: 12 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 13, offset: 12 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 13, offset: 12 } },
        },
      },
    ],
    [
      "boolean (false)",
      {
        yaml: "boolean: false",
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "boolean",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 7, offset: 6 } },
                },
                value: {
                  type: "Boolean",
                  value: false,
                  loc: { start: { line: 1, column: 10, offset: 9 }, end: { line: 1, column: 14, offset: 13 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 14, offset: 13 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 14, offset: 13 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 14, offset: 13 } },
        },
      },
    ],
    [
      'scalar "y" (1.1)',
      {
        yaml: "boolean: y",
        parseOptions: { version: "1.1" },
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "boolean",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 7, offset: 6 } },
                },
                value: {
                  type: "Boolean",
                  value: true,
                  loc: { start: { line: 1, column: 10, offset: 9 }, end: { line: 1, column: 10, offset: 9 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
        },
      },
    ],
    [
      'scalar "y" (1.2)',
      {
        yaml: "boolean: y",
        parseOptions: { version: "1.2" },
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "boolean",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 7, offset: 6 } },
                },
                value: {
                  type: "String",
                  value: "y",
                  loc: { start: { line: 1, column: 10, offset: 9 }, end: { line: 1, column: 10, offset: 9 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
        },
      },
    ],
    [
      'scalar "n" (1.1)',
      {
        yaml: "boolean: n",
        parseOptions: { version: "1.1" },
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "boolean",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 7, offset: 6 } },
                },
                value: {
                  type: "Boolean",
                  value: false,
                  loc: { start: { line: 1, column: 10, offset: 9 }, end: { line: 1, column: 10, offset: 9 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
        },
      },
    ],
    [
      'scalar "n" (1.2)',
      {
        yaml: "boolean: n",
        parseOptions: { version: "1.2" },
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "boolean",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 7, offset: 6 } },
                },
                value: {
                  type: "String",
                  value: "n",
                  loc: { start: { line: 1, column: 10, offset: 9 }, end: { line: 1, column: 10, offset: 9 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
        },
      },
    ],
    [
      "number (int)",
      {
        yaml: "number: 42",
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "number",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 6, offset: 5 } },
                },
                value: {
                  type: "Number",
                  value: 42,
                  loc: { start: { line: 1, column: 9, offset: 8 }, end: { line: 1, column: 10, offset: 9 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
        },
      },
    ],
    [
      "number (float)",
      {
        yaml: "number: 42.42",
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "number",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 6, offset: 5 } },
                },
                value: {
                  type: "Number",
                  value: 42.42,
                  loc: { start: { line: 1, column: 9, offset: 8 }, end: { line: 1, column: 13, offset: 12 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 13, offset: 12 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 13, offset: 12 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 13, offset: 12 } },
        },
      },
    ],
    [
      "number (no leading zero)",
      {
        yaml: "number: .423",
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "number",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 6, offset: 5 } },
                },
                value: {
                  type: "Number",
                  value: 0.423,
                  loc: { start: { line: 1, column: 9, offset: 8 }, end: { line: 1, column: 12, offset: 11 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 12, offset: 11 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 12, offset: 11 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 12, offset: 11 } },
        },
      },
    ],
    [
      "null",
      {
        yaml: "nullable: null",
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "nullable",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 8, offset: 7 } },
                },
                value: {
                  type: "Null",
                  loc: { start: { line: 1, column: 11, offset: 10 }, end: { line: 1, column: 14, offset: 13 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 14, offset: 13 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 14, offset: 13 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 14, offset: 13 } },
        },
      },
    ],
    [
      "object",
      {
        yaml: `object:
  property:
    foo: bar`,
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "object",
                  loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 6, offset: 5 } },
                },
                value: {
                  type: "Object",
                  members: [
                    {
                      type: "Member",
                      name: {
                        type: "String",
                        value: "property",
                        loc: { start: { line: 2, column: 4, offset: 10 }, end: { line: 2, column: 11, offset: 17 } },
                      },
                      value: {
                        type: "Object",
                        members: [
                          {
                            type: "Member",
                            name: {
                              type: "String",
                              value: "foo",
                              loc: {
                                start: { line: 3, column: 6, offset: 24 },
                                end: { line: 3, column: 8, offset: 26 },
                              },
                            },
                            value: {
                              type: "String",
                              value: "bar",
                              loc: {
                                start: { line: 3, column: 11, offset: 29 },
                                end: { line: 3, column: 13, offset: 31 },
                              },
                            },
                            loc: {
                              start: { line: 3, column: 6, offset: 24 },
                              end: { line: 3, column: 13, offset: 31 },
                            },
                          },
                        ],
                        loc: { start: { line: 3, column: 6, offset: 24 }, end: { line: 3, column: 13, offset: 31 } },
                      },
                      loc: { start: { line: 2, column: 4, offset: 10 }, end: { line: 3, column: 13, offset: 31 } },
                    },
                  ],
                  loc: { start: { line: 2, column: 4, offset: 10 }, end: { line: 3, column: 13, offset: 31 } },
                },
                loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 3, column: 13, offset: 31 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 3, column: 13, offset: 31 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 3, column: 13, offset: 31 } },
        },
      },
    ],
    [
      "array",
      {
        yaml: `- foo
- 42
- [1, 2, 3]
- foo:
    bar:
      - red
      - blue
      - green`,
        momoa: {
          type: "Document",
          body: {
            type: "Array",
            elements: [
              {
                type: "Element",
                value: {
                  type: "String",
                  value: "foo",
                  loc: { start: { line: 1, column: 3, offset: 2 }, end: { line: 1, column: 5, offset: 4 } },
                },
                loc: { start: { line: 1, column: 3, offset: 2 }, end: { line: 1, column: 5, offset: 4 } },
              },
              {
                type: "Element",
                value: {
                  type: "Number",
                  value: 42,
                  loc: { start: { line: 2, column: 4, offset: 8 }, end: { line: 2, column: 5, offset: 9 } },
                },
                loc: { start: { line: 2, column: 4, offset: 8 }, end: { line: 2, column: 5, offset: 9 } },
              },
              {
                type: "Element",
                value: {
                  type: "Array",
                  elements: [
                    {
                      type: "Element",
                      value: {
                        type: "Number",
                        value: 1,
                        loc: { start: { line: 3, column: 5, offset: 14 }, end: { line: 3, column: 5, offset: 14 } },
                      },
                      loc: { start: { line: 3, column: 5, offset: 14 }, end: { line: 3, column: 5, offset: 14 } },
                    },
                    {
                      type: "Element",
                      value: {
                        type: "Number",
                        value: 2,
                        loc: { start: { line: 3, column: 8, offset: 17 }, end: { line: 3, column: 8, offset: 17 } },
                      },
                      loc: { start: { line: 3, column: 8, offset: 17 }, end: { line: 3, column: 8, offset: 17 } },
                    },
                    {
                      type: "Element",
                      value: {
                        type: "Number",
                        value: 3,
                        loc: { start: { line: 3, column: 11, offset: 20 }, end: { line: 3, column: 11, offset: 20 } },
                      },
                      loc: { start: { line: 3, column: 11, offset: 20 }, end: { line: 3, column: 11, offset: 20 } },
                    },
                  ],
                  loc: { start: { line: 3, column: 4, offset: 13 }, end: { line: 3, column: 12, offset: 21 } },
                },
                loc: { start: { line: 3, column: 4, offset: 13 }, end: { line: 3, column: 12, offset: 21 } },
              },
              {
                type: "Element",
                value: {
                  type: "Object",
                  members: [
                    {
                      type: "Member",
                      name: {
                        type: "String",
                        value: "foo",
                        loc: { start: { line: 4, column: 4, offset: 25 }, end: { line: 4, column: 6, offset: 27 } },
                      },
                      value: {
                        type: "Object",
                        members: [
                          {
                            type: "Member",
                            name: {
                              type: "String",
                              value: "bar",
                              loc: {
                                start: { line: 5, column: 6, offset: 34 },
                                end: { line: 5, column: 8, offset: 36 },
                              },
                            },
                            value: {
                              type: "Array",
                              elements: [
                                {
                                  type: "Element",
                                  value: {
                                    type: "String",
                                    value: "red",
                                    loc: {
                                      start: { line: 6, column: 10, offset: 47 },
                                      end: { line: 6, column: 12, offset: 49 },
                                    },
                                  },
                                  loc: {
                                    start: { line: 6, column: 10, offset: 47 },
                                    end: { line: 6, column: 12, offset: 49 },
                                  },
                                },
                                {
                                  type: "Element",
                                  value: {
                                    type: "String",
                                    value: "blue",
                                    loc: {
                                      start: { line: 7, column: 10, offset: 59 },
                                      end: { line: 7, column: 13, offset: 62 },
                                    },
                                  },
                                  loc: {
                                    start: { line: 7, column: 10, offset: 59 },
                                    end: { line: 7, column: 13, offset: 62 },
                                  },
                                },
                                {
                                  type: "Element",
                                  value: {
                                    type: "String",
                                    value: "green",
                                    loc: {
                                      start: { line: 8, column: 10, offset: 72 },
                                      end: { line: 8, column: 14, offset: 76 },
                                    },
                                  },
                                  loc: {
                                    start: { line: 8, column: 10, offset: 72 },
                                    end: { line: 8, column: 14, offset: 76 },
                                  },
                                },
                              ],
                              loc: {
                                start: { line: 6, column: 8, offset: 45 },
                                end: { line: 8, column: 14, offset: 76 },
                              },
                            },
                            loc: {
                              start: { line: 5, column: 6, offset: 34 },
                              end: { line: 8, column: 14, offset: 76 },
                            },
                          },
                        ],
                        loc: { start: { line: 5, column: 6, offset: 34 }, end: { line: 8, column: 14, offset: 76 } },
                      },
                      loc: { start: { line: 4, column: 4, offset: 25 }, end: { line: 8, column: 14, offset: 76 } },
                    },
                  ],
                  loc: { start: { line: 4, column: 4, offset: 25 }, end: { line: 8, column: 14, offset: 76 } },
                },
                loc: { start: { line: 4, column: 4, offset: 25 }, end: { line: 8, column: 14, offset: 76 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 8, column: 14, offset: 76 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 8, column: 14, offset: 76 } },
        },
      },
    ],
    [
      // note: this behavior can change in the future; for now, just test it doesn’t break
      "comments are ignored",
      {
        yaml: `# ----
# My Document
# ----

foo: bar # Inline comment`,
        momoa: {
          type: "Document",
          body: {
            type: "Object",
            members: [
              {
                type: "Member",
                name: {
                  type: "String",
                  value: "foo",
                  loc: { start: { line: 5, column: 2, offset: 29 }, end: { line: 5, column: 4, offset: 31 } },
                },
                value: {
                  type: "String",
                  value: "bar",
                  loc: { start: { line: 5, column: 7, offset: 34 }, end: { line: 5, column: 9, offset: 36 } },
                },
                loc: { start: { line: 5, column: 2, offset: 29 }, end: { line: 5, column: 9, offset: 36 } },
              },
            ],
            loc: { start: { line: 5, column: 2, offset: 29 }, end: { line: 5, column: 26, offset: 53 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 5, column: 26, offset: 53 } },
        },
      },
    ],
    [
      "anchor",
      {
        yaml: `- &ref one
- *ref`,
        momoa: {
          type: "Document",
          body: {
            type: "Array",
            elements: [
              {
                type: "Element",
                value: {
                  type: "String",
                  value: "one",
                  loc: { start: { line: 1, column: 8, offset: 7 }, end: { line: 1, column: 10, offset: 9 } },
                },
                loc: { start: { line: 1, column: 8, offset: 7 }, end: { line: 1, column: 10, offset: 9 } },
              },
              {
                type: "Element",
                value: {
                  type: "String",
                  value: "one",
                  loc: { start: { line: 2, column: 4, offset: 13 }, end: { line: 2, column: 7, offset: 16 } },
                },
                loc: { start: { line: 2, column: 4, offset: 13 }, end: { line: 2, column: 7, offset: 16 } },
              },
            ],
            loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 2, column: 7, offset: 16 } },
          },
          loc: { start: { line: 1, column: 1, offset: 0 }, end: { line: 2, column: 7, offset: 16 } },
        },
      },
    ],
  ];

  test.each(tests)("%s", (_, { yaml, momoa, parseOptions }) => {
    expect(yamlToMomoa(yaml, parseOptions)).toEqual(momoa);
  });

  test.skipIf(() => os.platform() === "win32")("file", () => {
    const yaml = fs.readFileSync(new URL("./fixtures/radix.yaml", import.meta.url), "utf8");
    expect(JSON.stringify(yamlToMomoa(yaml))).toMatchFileSnapshot(
      fileURLToPath(new URL("./fixtures/expected.json", import.meta.url)),
    );
  });
});

describe("errors", () => {
  test("throws error if input isn’t string", () => {
    expect(() =>
      yamlToMomoa(
        // @ts-expect-error
        Buffer.from("yaml: true", "utf8"),
      ),
    ).toThrowError("source is not a string");
  });
});
