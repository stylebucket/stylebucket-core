---
'@stylebucket/css': patch
---

Update CSS Function to Parsing Strings as Raw. Doing the following would previously result in the `\` being dropped from the final css produced. This is fixed.

```typescript
export default css`
  .Navbar {
    &.\@root {
      font-size: 12px;
    }
  }
`;
```

Examples of when an extra escape is needed:

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
