const screens = {
  sm: { name: 'sm', selector: '\\:sm', px: '550px' },
  md: { name: 'md', selector: '\\:md', px: '800px' },
  lg: { name: 'lg', selector: '\\:lg', px: '1200px' },
} as const;

export function withScreens(selector: string, cssStr: string) {
  let output = `${selector} { ${cssStr} }`;
  for (const screen of Object.values(screens)) {
    output += (`
      @media all and (min-width: ${screen.px}) {
        ${selector}${screen.selector} {
          ${cssStr}
        }
      }
    `);
  }
  return output;
}
