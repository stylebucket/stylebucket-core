import { css } from '@stylebucket/css';

import { test, expect } from 'vitest';
import { parseCss } from './parse';

test('ParseCss With PostCSS Prop', () => {

  const styles = css`
    @media all and (min-width: 1200px) {
      .my-class {
        display: somePostCssFunction();
      }
      .\@root {
        font-size: 12px;
      }
    }
  `;

  const exp = (''
    + '@media all and (min-width: 1200px){'
    + '.my-class{display:somePostCssFunction()}'
    + '.\\@root{font-size:12px}'
    + '}'
  );

  expect(parseCss(styles).css).toBe(exp);
});
