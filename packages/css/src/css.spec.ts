import { test, expect } from 'vitest';
import { parseCss } from '@stylebucket/compiler';

import { css } from './css';

const color = 'green';

const styles = css`

  .test-class {
    color: ${color};
    font-size: 12px;
  }

  .another-test-class {
    background: ${color};
  }

`;

test('css function', () => {

  const expectRes = (''
    + '.test-class{color:green;font-size:12px}'
    + '.another-test-class{background:green}'
  );

  const { css: parsed } = parseCss(styles);

  expect(parsed).toBe(expectRes);

});
