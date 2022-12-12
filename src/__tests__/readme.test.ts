import { Cryptor } from '../index';

let cryptor: Cryptor;

describe('Basic Encrypt Assertion', () => {
  test('simple usage', () => {
    const cryptor = new Cryptor();
    const data = { simple: 'data' };
    expect([data]).toEqual(cryptor.decrypt(cryptor.encrypt([data])));
  });

  test('field is in origin raw data', () => {
    // given
    const cryptor = new Cryptor('@PreV_k$y', '@P0sT_k$y');
    const data = {
      bar: 'foo',
      aInt: 123,
      hello: 'crypt',
    };

    // when
    const cryptedData = cryptor.encrypt([data]);

    // then
    expect('bar' in cryptedData[0]).toBeTruthy();
  });

  test('pass array data', () => {
    // given
    const cryptor = new Cryptor('@PreV_k$y', '@P0sT_k$y');
    const array = [
      {
        bar: 'foo',
        aInt: 123,
        hello: 'crypt',
      },
    ];

    // when
    const cryptedData = cryptor.encrypt(array);

    // then
    expect(cryptedData).toHaveLength(1);
  });

  test('encrypt specific fields', () => {
    // given
    const cryptor = new Cryptor('@PreV_k$y', '@P0sT_k$y');
    const array = [
      {
        bar: 'foo',
        aInt: 123,
        hello: 'crypt',
        nested: {
          hi: 'i am here',
        },
      },
    ];

    // when
    const cryptedData = cryptor.encrypt(array, ['hello', 'nested.hi']);

    // then
    expect(cryptedData[0].bar).toBe('foo');
    expect(cryptedData[0].nested.hi).not.toBe('i am here');
  });
});

describe('Basic Decrypt Assertion', () => {
  test('without specific fields', () => {
    // given
    const cryptor = new Cryptor('@PreV_k$y', '@P0sT_k$y');
    const array = [
      {
        bar: 'foo',
        aInt: 123,
        hello: 'crypt',
      },
    ];

    // when
    const cryptedData = cryptor.encrypt(array);

    // then
    expect(array).toEqual(cryptor.decrypt(cryptedData));
  });

  test('with specific fields', () => {
    // given
    const cryptor = new Cryptor('@PreV_k$y', '@P0sT_k$y');
    const array = [
      {
        bar: 'foo',
        aInt: 123,
        hello: 'crypt',
      },
    ];

    // when
    const cryptedData = cryptor.encrypt(array, ['bar']);

    // then
    expect(array).toEqual(cryptor.decrypt(cryptedData, ['bar']));
  });
});
