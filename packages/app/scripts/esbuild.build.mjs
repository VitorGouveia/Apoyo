import esbuild from "esbuild"
import { TsconfigPathsPlugin } from "@esbuild-plugins/tsconfig-paths"
import { nodeExternalsPlugin } from "esbuild-node-externals"

esbuild.build({
  entryPoints: ["./src/index.ts"],
  platform: "node",
  bundle: true,
  minify: true,
  format: "cjs",
  outdir: "dist",
  loader: {
    ".ts": "ts",
  },
  plugins: [
    nodeExternalsPlugin(),
    TsconfigPathsPlugin({ tsconfig: "../tsconfig.json" }),
  ],
})
