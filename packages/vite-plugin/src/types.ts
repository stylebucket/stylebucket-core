import type { BuildConfig } from '@stylebucket/compiler';

export type PluginConfig = {

  /**
   * Options for compiler. Uses Vite's 'root' property
   * as workDir (cwd) by default
   */
  compiler?: BuildConfig,

  /**
   * Customize file ids
   */
  ids?: {

    /**
     * Customize the css filename created
     */
    buildStylesheetId?: (id: string) => string | undefined,

    /**
     * Function to match filenames created
     * using buildStylesheetId
     */
    matchStylesheetId?: (id: string) => boolean | undefined,

    /**
     *
     * Custom file matcher to identify which
     * ts/js files are source modules
     * for generating stylesheets. Default
     * matching is any .css.(ts|js) files.
     */
    matchSourceId?: (id: string) => boolean | undefined,
  }
};

export type InternalContext = {
  config: PluginConfig;
  moduleMap: Map<string, string>,
  viteWorkDir: string;
};
