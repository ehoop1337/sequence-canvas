const { build } = require('esbuild')
const { Generator } = require('npm-dts')
const { umdWrapper } = require("esbuild-plugin-umd-wrapper");
const { es5Plugin } = require('esbuild-plugin-es5');
const path = require('path');

// d.ts
new Generator({
  entry: 'src/sequence-canvas.ts',
  output: 'lib/sequence-canvas.d.ts',
}).generate().then(() => {
  console.log('End build lib/sequence-canvas.d.ts')
})


const shared = {
  entryPoints: ['src/index.ts'],
  sourcemap: true,
  bundle: true,
}

// web
// build({
//   ...shared,
//   outfile: 'lib/sequence-canvas.js',
//   // format: "umd",
//   plugins: [
//     es5Plugin(),
//     // umdWrapper(
//     //   {
//     //     libraryName: "SequenceCanvas"
//     //   }
//     // ),
//   ],
//   // minify: true,
//   target: ['es5'],
//   alias: {
//     '@swc/helpers': path.dirname(require.resolve('@swc/helpers/package.json')),
//   }
// }).then(() => {
//   console.log('End build lib/sequence-canvas.js')
// }).catch((e) => {
//   console.log('Error build lib/sequence-canvas.js:', e)
// });

// module
build({
  ...shared,
  outfile: 'lib/sequence-canvas.mjs',
  format: 'esm',
}).then(() => {
  console.log('End build lib/sequence-canvas.mjs')
}).catch((e) => {
  console.log('Error build lib/sequence-canvas.mjs:', e)
});

// module
build({
  ...shared,
  outfile: 'lib/sequence-canvas.cjs',
  format: 'cjs',
}).then(() => {
  console.log('End build lib/sequence-canvas.cjs')
}).catch((e) => {
  console.log('Error build lib/sequence-canvas.cjs:', e)
});
