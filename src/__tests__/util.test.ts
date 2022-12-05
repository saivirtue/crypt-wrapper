import { isArray, isObj, isString } from '../utils';

describe('Utility', () => {
  test('test is object', () => {
    expect(isObj({})).toBeTruthy();
    expect(isObj(new Object())).toBeTruthy();
    expect(isObj(undefined)).toBeFalsy();
    expect(isObj(null)).toBeFalsy();
    expect(isObj('123')).toBeFalsy();
    expect(isObj(444)).toBeFalsy();
    expect(isObj([])).toBeFalsy();
    expect(isObj(true)).toBeFalsy();
    expect(isObj(() => {})).toBeFalsy();
  });

  test('test is array', () => {
    expect(isArray([])).toBeTruthy();
    expect(isArray(new Array())).toBeTruthy();
    expect(isArray(Array(10).fill(1))).toBeTruthy();
    expect(isArray({})).toBeFalsy();
    expect(isArray(new Object())).toBeFalsy();
    expect(isArray(undefined)).toBeFalsy();
    expect(isArray(null)).toBeFalsy();
    expect(isArray('123')).toBeFalsy();
    expect(isArray(444)).toBeFalsy();
    expect(isArray(true)).toBeFalsy();
    expect(isArray(() => {})).toBeFalsy();
  });

  test('test is string', () => {
    expect(isString('123')).toBeTruthy();
    expect(isString(new String(''))).toBeTruthy();
    expect(isString({})).toBeFalsy();
    expect(isString(new Object())).toBeFalsy();
    expect(isString(undefined)).toBeFalsy();
    expect(isString(null)).toBeFalsy();
    expect(isString(444)).toBeFalsy();
    expect(isString([])).toBeFalsy();
    expect(isString(true)).toBeFalsy();
    expect(isString(() => {})).toBeFalsy();
  });
});
