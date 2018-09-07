import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
// import ts from 'rollup-plugin-typescript2';
// import typescript from 'typescript'

const config = require( './package' );

const banner =
  '/*!\n' +
  ' * Share.js v' + config.version + '\n' +
  ' * last update: ' + (new Date()).toLocaleString() + ', author: skeetershi\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const sconfig = {
  index:{
    input: './src/index.js',
    output: './dist/bundle.js'
  },
  test:{
    input: './src/test.js',
    output: './dist/test1.js'
  }
};
const mubiao = sconfig['index'];

export default {
  input: mubiao.input,
  plugins: [
    resolve(),
    builtins(),
    commonjs({
      include: "node_modules/**"
    }),
    babel({
      exclude: './node_modules/**',
      runtimeHelpers: true,
      plugins: [
        'external-helpers',
        "transform-runtime"
      ]
    })
  ],
  output: {
    file: mubiao.output,
    moduleName: 'Share',
    format: 'umd',
    name: 'Share',
    globals: 'Share',
    banner: banner
  }
};