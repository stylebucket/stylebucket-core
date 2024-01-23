import { test, expect, describe, expectTypeOf } from 'vitest';
import { stripQueryParams } from './ids';

describe('stripQueryParams Function', () => {

  test('With Query Param', () => {
    const filePath = '/some/absolute/path/to/source.ts?hmr=true';
    const res = stripQueryParams(filePath);

    expectTypeOf(res).toEqualTypeOf<[string, string]>();
    expect(res.length).toBe(2);
    expect(res[0]).toBe('/some/absolute/path/to/source.ts');
    expect(res[1]).toBe('?hmr=true');
  });

  test('Without Query Params', () => {
    const filePath = '/some/absolute/path/to/source.ts';
    const res = stripQueryParams(filePath);

    expectTypeOf(res).toEqualTypeOf<[string, string]>();
    expect(res.length).toBe(2);
    expect(res[0]).toBe('/some/absolute/path/to/source.ts');
    expect(res[1]).toBe('');
  });

});
