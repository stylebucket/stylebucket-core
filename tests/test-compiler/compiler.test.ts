import process from 'node:process';

import { buildStylesheet } from '@stylebucket/compiler';
import { test, expect } from 'vitest';
import{ resolve } from 'pathe';

const workDir = resolve(process.cwd(), __dirname);

test('Stylesheet Output', async () => {

  const buildRes = await buildStylesheet('./src/stylesheet.css.ts', { workDir });

  const innerCss = '{background:gray;font-size:1rem;color:#0B6623}';

  const stylesheetExpected = (''
    + '.sub{font-size:2rem;color:#0B6623}'
    + `.main${innerCss}`
    + `@media all and (min-width: 550px){.main\\:sm${innerCss}}`
    + `@media all and (min-width: 800px){.main\\:md${innerCss}}`
    + `@media all and (min-width: 1200px){.main\\:lg${innerCss}}`
    + '.postCssClass{font-size:somePostCssFunction()}'
  );

  expect(buildRes?.stylesheet).toBe(stylesheetExpected);
});
