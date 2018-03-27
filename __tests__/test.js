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

beforeEach(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), './'));
});
afterEach(async () => {
  await rimraf(dir, () => {});
});

test('save page', async () => {
  const host = 'http://test.com';
  nock(host)
    .get('/page')
    .reply(200, await fs.readFile(path.resolve('__tests__/__fixtures__/page.html'), 'utf8'));

  const page = `${host}/page`;

  await loader(page, dir);
  const [loadData, checkData] = await Promise.all([fs.readFile(`${dir}/test-com-page.html`, 'utf8'),
    fs.readFile(path.resolve('__tests__/__fixtures__/page.html'), 'utf8')]);
  expect(loadData).toBe(checkData);
});
