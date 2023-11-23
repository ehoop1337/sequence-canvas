const { build } = require('esbuild')

// options
const shared = {
  entryPoints: ['src/index.ts'],
  sourcemap: true,
  bundle: true,
}

// mjs
build({
  ...shared,
  outfile: 'lib/sequence-canvas.mjs',
  format: 'esm',
}).then(() => {
  console.log('End build lib/sequence-canvas.mjs')
}).catch((e) => {
  console.log('Error build lib/sequence-canvas.mjs:', e)
});

// cjs
build({
  ...shared,
  outfile: 'lib/sequence-canvas.cjs',
  format: 'cjs',
}).then(() => {
  console.log('End build lib/sequence-canvas.cjs')
}).catch((e) => {
  console.log('Error build lib/sequence-canvas.cjs:', e)
});
