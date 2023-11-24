const { build } = require('esbuild');

// options
const shared = {
  entryPoints: ['src/index.ts'],
  sourcemap: false,
  bundle: true,
}

// mjs
build({
  ...shared,
  outfile: 'lib/index.js',
  format: 'esm',
}).then(() => {
  console.log('End build lib/index.js')
}).catch((e) => {
  console.log('Error build lib/index.js:', e)
});

// cjs
build({
  ...shared,
  outfile: 'lib/index.cjs',
  format: 'cjs',
}).then(() => {
  console.log('End build lib/index.cjs')
}).catch((e) => {
  console.log('Error build lib/index.cjs:', e)
});
