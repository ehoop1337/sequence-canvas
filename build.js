const { build } = require('esbuild')
const { Generator } = require('npm-dts')

new Generator({
  entry: 'src/sequence-canvas.ts',
  output: 'lib/sequence-canvas.d.ts',
}).generate()

const shared = {
  entryPoints: ['src/index.ts'],
  sourcemap: true,
  bundle: true,
}
//
// build({
//   ...shared,
//   outfile: 'lib/sequence-canvas.js',
// })

build({
  ...shared,
  outfile: 'lib/sequence-canvas.esm.js',
  format: 'esm',
})
