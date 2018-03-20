import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';

import os from 'os';
import fs from 'mz/fs';
import path from 'path';
import rimraf from 'rimraf';

import loader from '../src';

axios.defaults.adapter = httpAdapter;

let dir = '';

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), './'));
});
afterEach(() => {
  rimraf(dir, () => {});
});

test('save page', async () => {
  const host = 'http://test.com';
  nock(host)
    .get('/page')
    .reply(200, fs.readFileSync(path.resolve('__tests__/__fixtures__/page.html'), 'utf8'));

  const page = `${host}/page`;

  await loader(page, dir);
  const [loadData, checkData] = await Promise.all([fs.readFile(`${dir}/test-com-page.html`, 'utf8'),
    fs.readFile(path.resolve('__tests__/__fixtures__/page.html'), 'utf8')]);
  expect(loadData).toBe(checkData);

  /* await loader(page, dir);
  const loadData = await fs.readFile(`${dir}/index.html`, 'utf8');
  const checkData = await fs.readFile(path.resolve('__tests__/__fixtures__/page.html'), 'utf8');
  expect(loadData).toBe(checkData); */

  /* return loader(page, dir)
    .then(() => {
      const loadData = fs.readFile(`${dir}/index.html`, 'utf8');
      const checkData = fs.readFile(path.resolve('__tests__/__fixtures__/page.html'), 'utf8');
      return Promise.all([loadData, checkData]);
    })
    .then(([loadData, checkData]) => expect(loadData).toBe(checkData)); */

  /* return loader(page, dir)
    .then(() => fs.readFile(`${dir}/index.html`, 'utf8'))
    .then((loadData) => {
      const readCheckData = fs.readFile(path.resolve('__tests__/__fixtures__/page.html'), 'utf8');
      return Promise.all([loadData, readCheckData]);
    })
    .then(([loadData, checkData]) => expect(loadData).toBe(checkData)); */
});
