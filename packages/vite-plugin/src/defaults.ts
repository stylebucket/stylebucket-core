import { type PluginConfig } from './types';

export function pluginDefaults
()
{
  const defaults = {
    ids: {
      matchSourceId: (id: string) => /\.css\.(ts|js)$/.test(id),
      buildStylesheetId: (id: string) => id.replace(/\.css\.(ts|js)$/, '.compiled.css'),
      matchStylesheetId: (id: string) => id.endsWith('.compiled.css'),
    }
  } as const satisfies PluginConfig;
  return defaults;
}
