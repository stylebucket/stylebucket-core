export function css
(
  strings: TemplateStringsArray,
  ...interpolations: (string | number)[]
)
: string
{
  if (!Array.isArray(strings)) return '';
  if (!strings.length) return '';

  /*
    String array is always 1 length longer than interpolations array
    e.g. string, interp, string, interp, string, interp, string.
    Always begins and ends with string.
  */

  let cssStr = '';
  let index = 0;
  cssStr += strings[0];

  for (const interpolation of interpolations) {
    cssStr += interpolation.toString();
    index += 1;
    cssStr += strings[index] ? strings[index] : '';
  }

  return cssStr;
}
