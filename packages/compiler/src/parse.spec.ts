import { test, expect } from 'vitest';
import { parseCss } from './parse';

test('ParseCss With PostCSS Prop', () => {

  const css = `
    @media all and (min-width: 1200px) {
      .my-class {
        display: somePostCssFunction();
      }
    }
  `;

  const exp = (''
    + '@media all and (min-width: 1200px)'
    + '{.my-class{display:somePostCssFunction()}}'
  );

  expect(parseCss(css).css).toBe(exp);
});
