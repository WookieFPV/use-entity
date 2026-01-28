import { readFileSync } from "node:fs";
import { defineConfig } from "tsup";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as {
	peerDependencies?: Record<string, string>;
	dependencies?: Record<string, string>;
};

const external = [...Object.keys(pkg.peerDependencies ?? {}), ...Object.keys(pkg.dependencies ?? {})];

export default defineConfig({
	entry: ["index.ts", "tanstack.ts"],
	format: ["esm", "cjs"],
	dts: true,
	sourcemap: true,
	clean: true,
	treeshake: true,
	splitting: true,
	target: "es2020",
	platform: "neutral",
	external,
});
