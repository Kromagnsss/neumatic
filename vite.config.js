import { extname, resolve } from 'path';
import { defineConfig } from 'vite';
import { existsSync, readFileSync, readdirSync } from 'fs';

const examplesDir = resolve(__dirname, 'source/examples');

function listExamples() {
  if (!existsSync(examplesDir)) return [];

  return readdirSync(examplesDir, {withFileTypes: true})
    .filter(entry => entry.isFile() && extname(entry.name).toLowerCase() === '.txt')
    .map(entry => ({
      file: entry.name,
      name: entry.name.replace(/\.[^/.]+$/, ''),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, {sensitivity: 'base'}));
}

function examplesPlugin() {
  return {
    name: 'neumatic-examples',

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url || '').split('?')[0];
        if (path !== '/examples-manifest.json') {
          next();
          return;
        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(listExamples(), null, 2));
      });
    },

    generateBundle() {
      const examples = listExamples();
      this.emitFile({
        type: 'asset',
        fileName: 'examples-manifest.json',
        source: JSON.stringify(examples, null, 2),
      });

      for (const example of examples) {
        this.emitFile({
          type: 'asset',
          fileName: `examples/${example.file}`,
          source: readFileSync(resolve(examplesDir, example.file)),
        });
      }
    },
  };
}

export default defineConfig({
  base: './',
  root: 'source',
  plugins: [examplesPlugin()],
  build: {
    outDir: resolve(__dirname, 'docs'),
    emptyOutDir: true, // Limpia la carpeta build antes de construir
    
    rollupOptions: {
        
      input: {
        main: resolve(__dirname, 'source/index.html'), // Entrada principal
      },        
        
      output: {
        // Deshabilita la división automática de chunks dinámicos
        inlineDynamicImports: true,
        
        // Define el formato de salida
        format: 'iife',
        
        // Opcional: Personaliza el nombre del archivo de salida
        entryFileNames: `neumatic.js`,
        
        // Opcional: Personaliza el nombre del archivo CSS si también se incluye CSS
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'neumatic.css';
          }
          return 'assets/[name].[extname]';
        },
      },
    },
  },
});
