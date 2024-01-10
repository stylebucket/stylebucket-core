
import type { CssNode } from 'css-tree';
import type { BuildOptions as EsbuildOptions } from 'esbuild';

import vm from 'node:vm';
import process from 'node:process';

import { build } from 'esbuild';
import { resolve } from 'pathe';

import { parseCss } from './parse';

/**
 * Config Options for Building a Stylesheet
 */
export type BuildConfig = {

  /**
   * Current Working Directory (cwd). Can be
   * absolute path, or relative to process.cwd().
   */
  workDir? : string,

  /**
   * Available ESBuild Options for Bundling the Stylesheet source file
   */
  esbuild?: Pick<EsbuildOptions, 'tsconfig' | 'tsconfigRaw' | 'alias' | 'plugins'>;

};

/**
 * Result of a completed stylesheet build
 */
export type BuildOutput = {

  /**
   * File path of js/ts module used to generate stylesheet
   */
  sourceFile: string,

  /**
   * Generated css string of stylesheet
   */
  stylesheet: string,

  /**
   * Abstract syntax tree of stylesheet
   */
  ast: CssNode,

};

export async function buildStylesheet
(
  filePath: string,
  config?: BuildConfig,
)
: Promise<BuildOutput | undefined> // [path, res]
{

  const workDir = (
    config?.workDir
      ? resolve(process.cwd(), config.workDir)
      : process.cwd()
  );

  const resolvedFilePath = resolve(workDir, filePath);

  const userOptions: BuildConfig['esbuild'] = {
    ...(
      config?.esbuild?.alias
      && { alias: config.esbuild.alias }
    ),
    ...(
      config?.esbuild?.tsconfig
      && { tsconfig: config.esbuild.tsconfig }
    ),
    ...(
      config?.esbuild?.tsconfigRaw
      && { tsconfigRaw: config.esbuild.tsconfigRaw }
    ),
    ...(
      config?.esbuild?.plugins
      && { plugins: config.esbuild.plugins }
    ),
  };

  const bundle = await build({
    entryPoints: [filePath],
    format: 'iife',
    absWorkingDir: workDir,
    write: false,
    platform: 'node',
    sourcemap: false,
    metafile: false,
    splitting: false,
    minify: false,
    bundle: true,
    target: 'esnext',
    globalName: 'stylebucketStylesheet',
    footer: { js: 'stylebucketStylesheet?.default' },
    ...userOptions,
  });

  let bundleText = '';

  if (bundle.outputFiles.length === 1) {
    bundleText += bundle.outputFiles[0]?.text ?? '';
  }

  /*
    as string | undefined depends on the
    esbuilt 'footer' option
  */
  const evalRes = await vm.runInThisContext(
    bundleText,
    { filename: resolvedFilePath, timeout: 1000 },
  ) as string | undefined;

  if (!evalRes) return;

  const { css, ast } = parseCss(evalRes);

  return {
    sourceFile: resolvedFilePath,
    stylesheet: css,
    ast: ast,
  };
}
