import type { CssNode } from 'css-tree';
import { parse, generate } from 'css-tree';

export function parseCss
(
  rawCss: string,
)
: { ast: CssNode, css: string }
{
  const ast = parse(
    rawCss,
    {
      positions: true,
      parseAtrulePrelude: false,
      parseCustomProperty: false,
      parseValue: false,
    }
  );
  const css = generate(ast, { sourceMap: false });
  return {
    ast,
    css,
  };
}
