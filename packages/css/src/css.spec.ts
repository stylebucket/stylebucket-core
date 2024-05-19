import { test, expect } from 'vitest';
import { css } from './css';

const color = 'green';
const size = 14;

const styles = css`

  .test-class {
    color: ${color};
    font-size: ${size}px;
  }

  .another-test-class {
    background: ${color};
  }

  /* Some CSS Comment */
  .\@root {
    font-size: 10px;
  }

`;

test('css function', () => {
  const stylesMinified = styles.replace(/\s/g,'');
  const stylesMinifiedExpect = (''
    + '.test-class{color:green;font-size:14px;}'
    + '.another-test-class{background:green;}'
    + '/*SomeCSSComment*/'
    + '.\\@root{font-size:10px;}'
  );
  /* Need to double escape ('.\\') only for the test case
     as we need to escape the escape in this string.
     The css`` func only outputs a single escape
     as written */
  expect(stylesMinified).toBe(stylesMinifiedExpect);
});
