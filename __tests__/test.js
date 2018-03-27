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

const compare = async (path1, path2) => {
  const [file1, file2] = await Promise.all([fs.readFile(path1, 'utf8'),
    fs.readFile(path2, 'utf8')]);
  expect(file1).toBe(file2);
};

test('save page', async () => {
  const host = 'http://test.com';
  const pathPage = path.join(__dirname, '__fixtures__/page.html');
  const pathFavicon = path.join(__dirname, '__fixtures__/favicon.ico');
  const pathRuby = path.join(__dirname, '__fixtures__/ruby.png');
  nock(host)
    .get('/page')
    .reply(200, await fs.readFile(pathPage, 'utf8'));
  nock(host)
    .get('/assets/icons/default/favicon.ico')
    .reply(200, await fs.readFile(pathFavicon));
  nock(host)
    .get('/images/ruby.png')
    .reply(200, await fs.readFile(pathRuby));

  const page = `${host}/page`;
  const pathFiles = 'test-com-page_files';

  await loader(page, dir);
  await compare(path.join(dir, 'test-com-page.html'), pathPage);
  await compare(path.join(dir, pathFiles, 'assets-icons-default-favicon.ico'), pathFavicon);
  await compare(path.join(dir, pathFiles, 'images-ruby.png'), pathRuby);
});
