import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import glsl from "vite-plugin-glsl";
import html from "@tomjs/vite-plugin-html";

import ect from "ect-bin";
import { execFileSync } from "node:child_process";
import { statSync } from "fs";

export default defineConfig({
  // prettier-ignore
  plugins: [
    glsl({ compress: true }),
    html(),
    viteSingleFile({ removeViteModuleLoader: true }),
    ectPlugin()
  ],
});

/**
 * Creates the ECT plugin that uses Efficient-Compression-Tool to build a zip file.
 * @returns The ECT plugin.
 */
function ectPlugin() {
  return {
    name: "vite:ect",
    writeBundle: async () => {
      try {
        const args = ["-strip", "-zip", "-10009", "dist/index.html"];
        const result = execFileSync(ect, args);
        console.log("ECT result", result.toString().trim());
        const stats = statSync("dist/index.zip");
        console.log("ZIP size", stats.size);
      } catch (err) {
        console.log("ECT error", err);
      }
    },
  };
}
