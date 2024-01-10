import { test, expect } from 'vitest';
import { css } from '@stylebucket/css';
import { parseCss } from '@stylebucket/compiler';

import { withScreens } from './screens';

test('Screens correctly adds css', () => {

  const styles = css`
    ${withScreens('.test', css`
      display: block;
      font-size: 24px;
    `)}
  `
  const { css: res } = parseCss(styles);
  const cssBlock = '{display:block;font-size:24px}';

  const resExpect = (''
    + `.test${cssBlock}`
    + `@media all and (min-width: 550px){.test\\:sm${cssBlock}}`
    + `@media all and (min-width: 800px){.test\\:md${cssBlock}}`
    + `@media all and (min-width: 1200px){.test\\:lg${cssBlock}}`
  );

  expect(res).toBe(resExpect);

});
