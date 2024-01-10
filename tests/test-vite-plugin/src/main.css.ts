import { css } from '@stylebucket/css';
import { classNames } from './main.style';

const { heading } = classNames;

export default css`

  main {
    background: green;
  }

  ${heading.selector} {
    font-size: 3rem;
    font-family: Arial, Helvetica, sans-serif;
  }

`;
