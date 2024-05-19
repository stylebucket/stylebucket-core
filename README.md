# Stylebucket Core

Stylebucket is an unopinionated zero-runtime CSS-in-JS tool with minimal magic under the hood.
Very early dev atm, but usable with Vite. Breaking changes may happen on minor releases until 1.0

For now:

- Only works with globally scoped css (adding scopes is up to you manually)
- Css modules untested
- Scopes are not auto added when imported into .vue or .svelte components
- Vite plugin checks for .css.ts or .css.js files as the source for stylesheets. Only default export
  from these files is permitted for now.

## Why?

The long-term goal for Stylebucket is to provide tooling for developers to build fully typed styling systems
exactly how they want to. With little to no learning curve, and little to no magic happening under the hood.

## Getting Started

Install Stylebucket as a dev dependency.

```bash
pnpm add -D @stylebucket/css @stylebucket/vite-plugin
```

Install the styled components vscode extension for syntax highlighting:
https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components

```typescript
// vite.config.(ts|js)

import { defineConfig } from 'vite';
import { stylebucket } from '@stylebucket/vite-plugin';

export default defineConfig({
  ...
  plugins: [
    stylebucket(),
  ],
})
```

Example:

```typescript
// utils/screens.(ts|js)

const screens = {
  sm: { name: 'sm', selector: '\\:sm', px: '550px' },
  md: { name: 'md', selector: '\\:md', px: '800px' },
  lg: { name: 'lg', selector: '\\:lg', px: '1200px' },
} as const;

export function withScreens(selector: string, cssStr: string) {
  let output = `${selector} { ${cssStr} }`;
  for (const screen of Object.values(screens)) {
    output += `
      @media all and (min-width: ${screen.px}) {
        ${selector}${screen.selector} {
          ${cssStr}
        }
      }
    `;
  }
  return output;
}
```

```typescript
// MyComponent.style.(ts|js)
export const ids = {
  main: {
    name: 'main',
    selector: '.main',
  },
} as const;

export const colors = {
  green: '#0B6623',
} as const;
```

```typescript
// MyComponent.css.(ts|js)

import { css } from '@stylebucket/css';
import { addSizes } from '../utils/screens';
import { ids, colors } from './MyComponent.style';

// styled components vscode extension
// will add css syntax highlighting here
export default css`
  .sub {
    font-size: 2rem;
    color: ${colors.green};
  }
  ${withScreens(
    ids.main.selector,
    css`
      background: gray;
      font-size: 1rem;
      color: ${colors.green};
    `,
  )}
`;
```

```typescript
// MyComponent.(ts|js)

import './MyComponent.css';
import { ids, colors } from './MyComponent.style';

// rest of your component logic
```

## Escaping Strings

Certain characters in CSS need to be escaped (like `:` and `@`).
However simply doing `\:` and `\@` isn't as straightforward as the
escape will also apply in Javascript. Thus cancelling out the escape
character. Below is a guide on where a double escape is needed.

```typescript
// dont, as '\' will be dropped
const rootTag = '.@root';
const rootTag = `.\@root`;

// do
const rootTag = '.\\@root';
const rootTag = `.\\@root`;
const rootTag = String.raw`.\@root`;

// also works
import { css } from '@stylebucket/css';
const rootTag = css`.\@root`;
```
