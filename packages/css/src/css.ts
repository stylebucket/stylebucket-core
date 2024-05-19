export function css
(
  strings: TemplateStringsArray,
  ...interpolations: (string | number)[]
)
: string
{
  return String.raw(strings, ...interpolations);
}
