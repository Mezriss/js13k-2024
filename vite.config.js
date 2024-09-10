import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import html from "@tomjs/vite-plugin-html";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [glsl({ compress: true }), viteSingleFile({ removeViteModuleLoader: true }), html({ minify: true })],
  build: {
    rollupOptions: {
      treeshake: "recommended",
      // https://rollupjs.org/configuration-options/
    },
  },
});
