import { Cryptor } from '../index';

let cryptor: Cryptor;

describe.skip('Performance (For Testing purpose)', () => {
  beforeAll(() => {
    cryptor = new Cryptor('simpleKey', 'C0mp!exK$y');
  });

  test('Print Performance', () => {
    const mockData = {
      id: 37916515,
      status: 35983765,
      company_name: 'Excepteur',
      name: 'proident nostrud ullamco anim',
      emplid: 'incididunt',
      insured_relation: 'id',
      insured_name: 'nisi',
      insured_id: 'ut proident aute',
      insured_birthday: 'ut mollit Duis aliquip fugiat',
      contact: 'enim',
      address: 'aliqua enim adipisicing',
      transfer_bank_name: 'officia',
      transfer_bank_account: 'laboris elit occaecat',
      receive_mode: 'in sunt velit nostrud',
      receive_phone: 'commodo reprehenderit sed Lorem',
      receive_email: 'Excepteur enim ex consequat',
      accident_time: 'officia culpa Ut Lorem',
      is_reported: false,
      report_time: 'sint',
      report_unit: 'in',
      report_pic: 'pariatur ex dolore',
      report_contact: 'quis proident nisi do nostrud',
      report_desc: 'Ut deserunt fugiat incididunt non',
      lns_file: 'Duis pariatur exercitation',
      update_by: 'anim aliqua enim eiusmod dolor',
      update_time: 72255609,
    };
    const fields = [
      'company_name',
      'name',
      'emplid',
      'insured_relation',
      'insured_name',
      'insured_id',
      'insured_birthday',
      'contact',
      'address',
      'transfer_bank_name',
      'transfer_bank_account',
      'receive_mode',
      'receive_phone',
      'receive_email',
      'accident_time',
      'is_reported',
      'report_time',
      'report_unit',
      'report_pic',
      'report_contact',
      'report_desc',
      'lns_file',
    ];

    let input: any[];
    let encrypted: any[];
    let decrypted: any[];

    // Case 1: 100
    input = Array(100).fill(mockData);
    console.time('Case 1: 100 records - encrypt');
    encrypted = cryptor.encrypt(input, fields);
    console.timeEnd('Case 1: 100 records - encrypt');

    console.time('Case 1: 100 records - decrypt');
    decrypted = cryptor.decrypt(encrypted, fields);
    console.timeEnd('Case 1: 100 records - decrypt');

    expect(decrypted).toEqual(input);

    // Case 2: 1,000
    input = Array(1000).fill(mockData);
    console.time('Case 2: 1,000 records - encrypt');
    encrypted = cryptor.encrypt(input, fields);
    console.timeEnd('Case 2: 1,000 records - encrypt');

    console.time('Case 2: 1,000 records - decrypt');
    decrypted = cryptor.decrypt(encrypted, fields);
    console.timeEnd('Case 2: 1,000 records - decrypt');

    // // Case 3: 100,000
    input = Array(100000).fill(mockData);
    console.time('Case 3: 100,000 records - encrypt');
    encrypted = cryptor.encrypt(input, fields);
    console.timeEnd('Case 3: 100,000 records - encrypt');

    console.time('Case 3: 100,000 records - decrypt');
    decrypted = cryptor.decrypt(encrypted, fields);
    console.timeEnd('Case 3: 100,000 records - decrypt');
  });
});

describe('Encrypt/Decrypt without specific key', () => {
  beforeAll(() => {
    cryptor = new Cryptor();
  });

  test('simple sting array', () => {
    // given
    const data = ['a', 'b', 'foo'];

    // when
    const result = cryptor.encrypt(data);
    const decryptResult = cryptor.decrypt(result);

    // then
    expect(result).toHaveLength(data.length);
    expect(result).not.toEqual(data); // encrypted result should be different to original data
    expect(decryptResult).toEqual(data);
  });

  test('encrypt simple sting array with assigned fields has no effect', () => {
    // given
    const data = ['a', 'b', 'foo'];

    // when
    const withoutFieldResult = cryptor.encrypt(data);
    const withoutFieldOrigin = cryptor.decrypt(withoutFieldResult);
    const withFieldResult = cryptor.encrypt(data, ['a', 'b', 'bar']);
    const withFieldOrigin = cryptor.decrypt(withFieldResult, ['a', 'b', 'bar']);

    // then
    expect(withoutFieldOrigin).toHaveLength(withFieldOrigin.length);
    expect(withoutFieldOrigin).toEqual(withFieldOrigin);
  });

  test('encrypt complex object instances', () => {
    // given
    const data = [
      {
        aNumber: 123123,
      },
      {
        status: 200,
        meta: {
          header: 'text/plain',
          ssl: true,
          filename: 'test',
        },
        data: [
          {
            code: 1,
            isActivity: false,
            message: 'hello from there',
            supported: ['typeA', 'typeB'],
          },
          {
            code: 2,
            isActivity: true,
            message: 'hello from there',
            supported: ['typeA', 'typeC'],
          },
        ],
      },
    ];

    // when
    const result = cryptor.encrypt(data);
    const decryptResult = cryptor.decrypt(result);

    // then
    expect(result[0].aNumber).toBe(data[0].aNumber);
    expect(result[1].status).toBe(data[1].status);
    expect(result[1].meta?.header).not.toEqual(data[1].meta?.header);
    expect(result[1].data?.[0].supported).not.toEqual(data[1].data?.[0].supported);
    expect(decryptResult).toEqual(data);
  });

  test('encrypt complex object instances with specific fields', () => {
    // given
    const data = [
      {
        aNumber: 123123,
      },
      {
        status: 200,
        meta: {
          header: 'text/plain',
          ssl: true,
          filename: 'test',
        },
        data: [
          {
            code: 1,
            isActivity: false,
            message: 'hello from there',
            supported: ['typeA', 'typeB'],
          },
          {
            code: 2,
            isActivity: true,
            message: 'hello from there',
            supported: ['typeA', 'typeC'],
          },
        ],
      },
    ];

    // when
    const result = cryptor.encrypt(data, ['meta.header', 'data.message']);
    const decryptResult = cryptor.decrypt(result, ['meta.header', 'data.message']);

    // then
    expect(result[0].aNumber).toBe(data[0].aNumber);
    expect(result[1].status).toBe(data[1].status);
    expect(result[1].meta?.header).not.toEqual(data[1].meta?.header);
    expect(result[1].meta?.filename).toEqual(data[1].meta?.filename);
    expect(result[1].data?.[0].supported).toEqual(data[1].data?.[0].supported);
    expect(result[1].data?.[1].message).not.toEqual(data[1].data?.[1].message);
    expect(decryptResult).toEqual(data);
  });
});

describe('Encrypt/Decrypt with backend and infra keys', () => {
  beforeAll(() => {
    cryptor = new Cryptor('fakeKey', 'AkeyMock');
  });

  test('encrypt simple sting array', () => {
    // given
    const data = ['a', 'b', 'foo'];

    // when
    const result = cryptor.encrypt(data);
    const decryptResult = cryptor.decrypt(result);

    // then
    expect(result).toHaveLength(data.length);
    expect(result).not.toEqual(data); // encrypted result should be different to original data
    expect(decryptResult).toEqual(data);
  });

  test('encrypt simple sting array with assigned fields has no effect', () => {
    // given
    const data = ['a', 'b', 'foo'];

    // when
    const withoutFieldResult = cryptor.encrypt(data);
    const withoutFieldOrigin = cryptor.decrypt(withoutFieldResult);
    const withFieldResult = cryptor.encrypt(data, ['a', 'b', 'bar']);
    const withFieldOrigin = cryptor.decrypt(withFieldResult, ['a', 'b', 'bar']);

    // then
    expect(withoutFieldOrigin).toHaveLength(withFieldOrigin.length);
    expect(withoutFieldOrigin).toEqual(withFieldOrigin);
  });

  test('encrypt complex object instances', () => {
    // given
    const data = [
      {
        aNumber: 123123,
      },
      {
        status: 200,
        meta: {
          header: 'text/plain',
          ssl: true,
          filename: 'test',
        },
        data: [
          {
            code: 1,
            isActivity: false,
            message: 'hello from there',
            supported: ['typeA', 'typeB'],
          },
          {
            code: 2,
            isActivity: true,
            message: 'hello from there',
            supported: ['typeA', 'typeC'],
          },
        ],
      },
    ];

    // when
    const result = cryptor.encrypt(data);
    const decryptResult = cryptor.decrypt(result);

    // then
    expect(result[0].aNumber).toBe(data[0].aNumber);
    expect(result[1].status).toBe(data[1].status);
    expect(result[1].meta?.header).not.toEqual(data[1].meta?.header);
    expect(result[1].data?.[0].supported).not.toEqual(data[1].data?.[0].supported);
    expect(decryptResult).toEqual(data);
  });

  test('encrypt complex object instances with specific fields', () => {
    // given
    const data = [
      {
        aNumber: 123123,
      },
      {
        status: 200,
        meta: {
          header: 'text/plain',
          ssl: true,
          filename: 'test',
        },
        data: [
          {
            code: 1,
            isActivity: false,
            message: 'hello from there',
            supported: ['typeA', 'typeB'],
          },
          {
            code: 2,
            isActivity: true,
            message: 'hello from there',
            supported: ['typeA', 'typeC'],
          },
        ],
      },
    ];

    // when
    const result = cryptor.encrypt(data, ['meta.header', 'data.message']);
    const decryptResult = cryptor.decrypt(result, ['meta.header', 'data.message']);

    // then
    expect(result[0].aNumber).toBe(data[0].aNumber);
    expect(result[1].status).toBe(data[1].status);
    expect(result[1].meta?.header).not.toEqual(data[1].meta?.header);
    expect(result[1].meta?.filename).toEqual(data[1].meta?.filename);
    expect(result[1].data?.[0].supported).toEqual(data[1].data?.[0].supported);
    expect(result[1].data?.[1].message).not.toEqual(data[1].data?.[1].message);
    expect(decryptResult).toEqual(data);
  });

  test('unrecognized encrypted data could not be decrypted', () => {
    // given
    const anotherCrypt = new Cryptor();
    const data = [{ bar: 'foo' }];

    // when
    const encryptedData = anotherCrypt.encrypt(data);
    const decryptResult = cryptor.decrypt(encryptedData);

    // then
    expect(decryptResult).toHaveLength(1);
    expect(decryptResult[0]).toHaveProperty('bar');
    expect(decryptResult[0].bar).toEqual('');
  });
});
