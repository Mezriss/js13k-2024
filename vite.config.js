import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    plugins: [
        glsl({ compress: true }),
        viteSingleFile({ removeViteModuleLoader: true }),
      ],
    build: {
    rollupOptions: {
      treeshake: 'recommended',
      // https://rollupjs.org/configuration-options/
    },
  },
})