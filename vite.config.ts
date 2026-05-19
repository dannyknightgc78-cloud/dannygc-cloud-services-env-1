import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy, vitePlugin as remixVite } from '@remix-run/dev';
import UnoCSS from 'unocss/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as dotenv from 'dotenv';

// Load environment variables from multiple files
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
dotenv.config();

export default defineConfig((config) => {
  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
    build: {
      target: 'esnext',
    },
    plugins: [
      nodePolyfills({
        include: ['buffer', 'process', 'util', 'stream', 'path'],
        globals: {
          Buffer: true,
          process: true,
          global: true,
        },
        protocolImports: true,
        exclude: ['child_process', 'fs'],
      }),
      {
        name: 'buffer-polyfill',
        transform(code, id) {
          if (id.includes('env.mjs')) {
            return {
              code: `import { Buffer } from 'buffer';\n${code}`,
              map: null,
            };
          }
          return null;
        },
      },
      remixCloudflareDevProxy(),
      remixVite({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_lazyRouteDiscovery: true,
        },
      }),
      tsconfigPaths(),
      UnoCSS(),
      optimizeCssModules(),
    ],
    envPrefix: [
      'VITE_',
      'OPENAI_',
      'ANTHROPIC_',
      'OPENROUTER_',
      'GOOGLE_',
      'GROQ_',
      'OLLAMA_',
      'TOGETHER_',
      'DEEPSEEK_',
      'MISTRAL_',
      'LMSTUDIO_',
      'XAI_',
      'PERPLEXITY_',
      'COHERE_',
      'AWS_',
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  };
});
