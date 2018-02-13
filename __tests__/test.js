import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';

import fs from 'fs';
import path from 'path';

import loader from '../src';

axios.defaults.adapter = httpAdapter;

test('save page', () => {
  const host = 'http://test.com';
  nock(host)
    .get('/page')
    .reply(200, fs.readFileSync(path.resolve('__tests__/__fixtures__/page.html'), 'utf8'));

  const page = `${host}/page`;
  const dir = '/home/deadmp3/projects/page-loader/tmp';

  return loader(page, dir)
    .then(() => fs.readFileSync(`${dir}/index.html`, 'utf8'))
    .then(data => expect(data).toBe(fs.readFileSync(path.resolve('__tests__/__fixtures__/page.html'), 'utf8')));
});