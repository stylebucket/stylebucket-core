import { defu } from 'defu';
import { buildStylesheet } from '@stylebucket/compiler';

import {
  normalizePath,
  type Plugin as VitePlugin,
} from 'vite';

import {
  type PluginConfig,
  type InternalContext,
} from './types';

import { pluginDefaults } from './defaults';

import {
  stripQueryParams,
  buildStylesheetId,
  matchesSourceId,
  matchesStylesheetId,
  getIdFromModuleIdMap,
} from './ids';

export function stylebucket
(
  configArg?: PluginConfig,
)
: VitePlugin
{
  const CONFIG = defu(configArg, pluginDefaults());

  /** <Stylesheet Id, SourceId> | <SourceId, StylesheetId> */
  const MODULE_MAP = new Map<string, string>();

  const CONTEXT: InternalContext = {
    moduleMap: MODULE_MAP,
    config: CONFIG,
    viteWorkDir: '',
  };

  return {

    name: 'stylebucket',
    enforce: 'pre',

    configResolved(config) {
      CONTEXT.viteWorkDir = config.root;
    },

    async resolveId(idArg, importer, options) {
      const resolved = await this.resolve(idArg, importer, options);
      const normalized = normalizePath(resolved?.id ?? '');
      const [moduleId, query] = stripQueryParams(normalized);
      if (!matchesSourceId(moduleId, CONTEXT)) return;
      const stylesheetId = buildStylesheetId(moduleId, CONTEXT);
      MODULE_MAP.set(stylesheetId, moduleId);
      MODULE_MAP.set(moduleId, stylesheetId);
      return `${stylesheetId}${query}`;
    },

    async load(idArg) {
      const normalized = normalizePath(idArg);
      const [moduleId] = stripQueryParams(normalized);
      if (matchesStylesheetId(moduleId, CONTEXT)) {
        const stylesheetId = moduleId;
        const sourceModuleId = getIdFromModuleIdMap(stylesheetId, CONTEXT);
        if (!sourceModuleId) return;
        const buildOutput = (
          await buildStylesheet(sourceModuleId, CONTEXT.config.compiler)
        );
        return {
          code: buildOutput?.stylesheet ?? '',
          map: { mappings: ''},
        };
      }
    },

    handleHotUpdate(hmrInfo) {
      if (!matchesSourceId(hmrInfo.file, CONTEXT)) return;
      const stylesheetId = getIdFromModuleIdMap(hmrInfo.file, CONTEXT);
      if (!stylesheetId) return;
      const stylesheetModule = (
        hmrInfo.server.moduleGraph.getModuleById(stylesheetId)
      );
      if (!stylesheetModule) return;
      return [stylesheetModule];
    },

  };
}
