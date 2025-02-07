import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index.ts"],
  sourcemap: true,
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
});
