import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';

import os from 'os';
import fs from 'fs';
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

test('save page', () => {
  const host = 'http://test.com';
  nock(host)
    .get('/page')
    .reply(200, fs.readFileSync(path.resolve('__tests__/__fixtures__/page.html'), 'utf8'));

  const page = `${host}/page`;

  return loader(page, dir)
    .then(() => fs.readFileSync(`${dir}/index.html`, 'utf8'))
    .then(data => expect(data).toBe(fs.readFileSync(path.resolve('__tests__/__fixtures__/page.html'), 'utf8')));
});
