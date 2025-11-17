import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  shims: true,
  outExtension: ({ format }) => ({
    js: '.js',
  }),
  banner: {
    js: '#!/usr/bin/env node',
  },
});
