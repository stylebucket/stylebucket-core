import type { BuildConfig, BuildOutput } from '@stylebucket/compiler';

import type {
  Plugin as VitePlugin,
  ModuleNode as ViteModuleNode,
} from 'vite';

import { buildStylesheet } from '@stylebucket/compiler';

import { normalizePath } from 'vite';
import { defu } from 'defu';

export type PluginConfig = {

  /**
   * Options for for compiler
   */
  compiler?: BuildConfig,

  /**
   * Customize file ids
   */
  ids?: {

    /**
     * Customize the css filename created
     */
    buildStylesheetId?: (id: string) => string,

    /**
     * Function to match filenames created
     * using buildStylesheetId
     */
    matchStylesheetId?: (id: string) => boolean,

    /**
     *
     * Custom file matcher to identify which
     * ts/js files are source modules
     * for generating stylesheets. Default
     * matching is any .css.(ts|js) files.
     */
    matchSourceId?: (id: string) => boolean,
  }
}

export type PluginProps = {
  stylesheetsToSourceModules: Map<string, string>;
  sourceModulesToStylesheets: Map<string, string>;
}

export function stylebucket
(
  configArg?: PluginConfig,
)
: VitePlugin
{
  const CONFIG = defu(configArg, pluginDefaults());

  const PROPS: PluginProps = {
    // virtualStylesheetId: sourceModuleId
    stylesheetsToSourceModules: new Map<string, string>(),
    // sourceModuleId: virtualStylesheetId
    sourceModulesToStylesheets: new Map<string, string>(),
  };

  const PLUGIN: VitePlugin = {

    name: 'stylebucket',
    enforce: 'pre',

    resolveId(idArg) {
      const normalizedArg = normalizePath(idArg);
      const [id, query] = stripQueryParams(normalizedArg);
      if (!CONFIG.ids.matchStylesheetId(id)) return;
      return `${id}${query}`;
    },

    async load(idArg) {

      const normalizedArg = normalizePath(idArg);
      const [id] = stripQueryParams(normalizedArg);

      if (CONFIG.ids.matchStylesheetId(id)) {
        const context = { pluginProps: PROPS, config: CONFIG };
        const output = await loadStylesheet(id, context);
        if (!output) return;
        return {
          code: output.stylesheet,
          map: { mappings: ''},
        };
      }

      if (CONFIG.ids.matchSourceId(id)) {
        const context = { pluginProps: PROPS, config: CONFIG };
        const code = loadSourceModule(id, context);
        return {
          code,
          map: { mappings: ''},
        };
      }
    },

    handleHotUpdate(context) {
      const affectedModules = context.modules;
      const sourceModules = hmrFilterSourceModules(affectedModules, PROPS);
      if (!sourceModules.length) return;
      const idToModuleMap = context.server.moduleGraph.idToModuleMap;
      return hmrMapSourceToStylesheets(sourceModules, idToModuleMap, PROPS);
    }

  };

  return PLUGIN;
}

export async function loadStylesheet
(
  stylesheetId: string,
  context: {
    pluginProps: PluginProps,
    config: PluginConfig,
  },
)
: Promise<BuildOutput | undefined>
{
  const cssToSources = context.pluginProps.stylesheetsToSourceModules;
  const sourceModuleId = cssToSources.get(stylesheetId);
  if (!sourceModuleId) {
    throw new Error(`No Stylesheet Found: ${stylesheetId}`);
  }
  return await buildStylesheet(sourceModuleId, context.config.compiler)
}

export function loadSourceModule
(
  sourceModuleId: string,
  context: {
    pluginProps: PluginProps,
    config: PluginConfig,
  },
)
: string
{
  const buildId = context.config.ids?.buildStylesheetId;
  if (!buildId) return '';
  const stylesheetId = buildId(sourceModuleId);

  crossLinkSourceStylesheet(
    sourceModuleId,
    stylesheetId,
    context.pluginProps
  );

  return `import "${stylesheetId}";\n`;
}

function crossLinkSourceStylesheet
(
  sourceModuleId: string,
  stylesheetId: string,
  props: PluginProps,
)
: void
{
  props.sourceModulesToStylesheets.set(sourceModuleId, stylesheetId);
  props.stylesheetsToSourceModules.set(stylesheetId, sourceModuleId);
}

/**
 * Returns modules from Vite's module graph during HMR
 * that are js/ts source modules (e.g. the .css.{js|ts} modules)
 * used to compile stylesheets.
 */
export function hmrFilterSourceModules
(
  modules: ViteModuleNode[],
  props: PluginProps,
)
: ViteModuleNode[]
{
  const sourceModules = modules.filter((module) => {
    const moduleId = module.id ?? '';
    return props.sourceModulesToStylesheets.has(moduleId);
  });
  return sourceModules;
}

export function hmrMapSourceToStylesheets
(
  modules: ViteModuleNode[],
  idToModuleMap: Map<string, ViteModuleNode>,
  props: PluginProps,
)
: ViteModuleNode[]
{
  const stylesheetModules = [];
  const sourceToStyles = props.sourceModulesToStylesheets;

  for (const module of modules) {

    const stylesheetId = sourceToStyles.get(module.id ?? '');
    if (!stylesheetId) continue;

    const stylesheetModule = idToModuleMap.get(stylesheetId);
    if (!stylesheetModule) continue;

    stylesheetModules.push(stylesheetModule);
  }

  return stylesheetModules;
}

export function pluginDefaults
()
{
  const defaults = {
    ids: {
      matchStylesheetId: (id: string) => id.startsWith('virtual:css'),
      matchSourceId: (id: string) => /\.css\.(ts|js)$/.test(id),
      buildStylesheetId: (id: string) => `virtual:css${id}.css`,
    }
  } as const satisfies PluginConfig;
  return defaults;
}

/**
 * Vite sometimes adds query (?) params
 * to module ids for HMR.
 */
export function stripQueryParams
<
  T extends string,
>
(
  id: T,
)
: [string, string]
{
  const [url, query] = id.split('?', 2);
  return [
    url ?? '',
    query ? `?${query}` : '',
  ];
}
