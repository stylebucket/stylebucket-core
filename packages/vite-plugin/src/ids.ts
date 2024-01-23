import path from 'node:path';

import { type InternalContext } from './types';
import { normalizePath } from 'vite';
import { pluginDefaults } from './defaults';

/**
 * Accounts for ids relative to cwd instead of
 * the expected absolute ids
 */
export function getIdFromModuleIdMap
(
  id: string,
  context: InternalContext,
)
: string | undefined
{
  const absoluteId = toAbsoluteId(id, context);
  const fromCwd = id.replace(context.viteWorkDir, '');
  return (
    context.moduleMap.get(id) ||
    context.moduleMap.get(absoluteId) ||
    context.moduleMap.get(fromCwd)
  );
}

/**
 * Vite sometimes adds query (?) params
 * to module ids for HMR and other purposes
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

export function toAbsoluteId
(
  id: string,
  context: InternalContext,
)
: string
{
  return (
    id.includes(context.viteWorkDir)
      ? id
      : normalizePath(path.join(context.viteWorkDir, id))
  );
}

/**
 * Falls back to default matchSourceId if
 * config matchSourceId returns undefined
 */
export function matchesSourceId
(
  sourceModuleId: string,
  context: InternalContext,
)
: boolean
{
  const defaults = pluginDefaults();
  const matcher = (
    context.config.ids?.matchSourceId
    ?? defaults.ids.matchSourceId
  );
  let isMatched = matcher(sourceModuleId);
  if (isMatched === undefined) {
    isMatched = defaults.ids.matchSourceId(sourceModuleId);
  }
  return isMatched;
}

/**
 * Falls back to default matchStylesheetId if
 * config matchStylesheetId returns undefined
 */
export function matchesStylesheetId
(
  stylesheetId: string,
  context: InternalContext,
)
: boolean
{
  const defaults = pluginDefaults();
  const matcher = (
    context.config.ids?.matchStylesheetId
    ?? defaults.ids.matchStylesheetId
  );
  let isMatched = matcher(stylesheetId);
  if (isMatched === undefined) {
    isMatched = defaults.ids.matchStylesheetId(stylesheetId);
  }
  return isMatched;
}

/**
 * Falls back to default buildStylesheetId if
 * config buildStylesheetId returns undefined
 */
export function buildStylesheetId
(
  sourceModuleId: string,
  context: InternalContext,
)
: string
{
  const defaults = pluginDefaults();
  const builder = (
    context.config.ids?.buildStylesheetId
    ?? defaults.ids.buildStylesheetId
  );
  const stylesheetId = (
    builder(sourceModuleId)
    ?? defaults.ids.buildStylesheetId(sourceModuleId)
  )
  return stylesheetId;
}
