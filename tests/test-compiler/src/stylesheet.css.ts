import { css } from '@stylebucket/css';
import { colors, ids } from './stylesheet.style';
import { withScreens } from './screens';

export default css`

  .sub {
    font-size: 2rem;
    color: ${colors.green};
  }

  ${withScreens(ids.main.selector,
    css`
      background: gray;
      font-size: 1rem;
      color: ${colors.green};
    `,
  )}

  .postCssClass {
    font-size: somePostCssFunction();
  }

`;
