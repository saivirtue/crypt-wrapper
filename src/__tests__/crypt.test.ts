import { Crypt } from '../index';

const crypt = new Crypt();

describe('Performance', () => {
  test.skip('Print Performance', () => {
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

    // Case 1: 100
    let input = Array(100).fill(mockData);
    console.time('Case 1: 100 records - encrypt');
    const encrypted = crypt.encrypt(input, fields);
    console.timeEnd('Case 1: 100 records - encrypt');

    console.time('Case 1: 100 records - decrypt');
    const decrypted = crypt.decrypt(encrypted, fields);
    console.timeEnd('Case 1: 100 records - decrypt');

    expect(decrypted).toEqual(input);

    // // Case 1: 1,000
    // input = Array(1000).fill(mockData);
    // console.time('Case 2: 1,000 records');
    // crypt.encrypt(input, fields);
    // console.timeEnd('Case 2: 1,000 records');

    // // Case 1: 100,000
    // input = Array(100000).fill(mockData);
    // console.time('Case 3: 100,000 records');
    // crypt.encrypt(input, fields);
    // console.timeEnd('Case 3: 100,000 records');
  });
});

describe('Encrypt', () => {
  test('encrypt simple sting array', () => {
    // given
    const data = ['a', 'b', 'foo'];

    // when
    const result = crypt.encrypt(data);

    // then
    expect(result).toHaveLength(data.length);
    expect(result).not.toEqual(data); // encrypted result should be different to original data
  });

  test('encrypt simple sting array with assigned fields has no effect', () => {
    // given
    const data = ['a', 'b', 'foo'];

    // when
    const origin = crypt.encrypt(data);
    const result = crypt.encrypt(data, ['a', 'b', 'bar']);

    // then
    expect(result).toHaveLength(data.length);
    expect(origin).toEqual(result);
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
    const result = crypt.encrypt(data);

    // then
    //TODO recursive loop the data (most refactor the index.ts recusive function first)
    expect(result[0].aNumber).toBe(data[0].aNumber);
    expect(result[1].status).toBe(data[1].status);
    expect(result[1].meta?.header).not.toEqual(data[1].meta?.header);
    expect(result[1].data?.[0].supported).not.toEqual(data[1].data?.[0].supported);
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
    const result = crypt.encrypt(data, ['meta.header', 'data.message']);

    // then
    //TODO recursive loop the data (most refactor the index.ts recusive function first)
    expect(result[0].aNumber).toBe(data[0].aNumber);
    expect(result[1].status).toBe(data[1].status);
    expect(result[1].meta?.header).not.toEqual(data[1].meta?.header);
    expect(result[1].meta?.filename).toEqual(data[1].meta?.filename);
    expect(result[1].data?.[0].supported).toEqual(data[1].data?.[0].supported);
    expect(result[1].data?.[1].message).not.toEqual(data[1].data?.[1].message);
  });
});
