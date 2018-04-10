import axios from 'axios';
import fs from 'mz/fs';
import path from 'path';
import { uniq } from 'lodash';
import createDebug from 'debug';
import getLinks from './parser';
import { getLocalLink, pageName, catalogName, isLocalLink, fullLink } from './names';

const debug = createDebug('loader');

const saveLocalLinks = (getLoadLinks, dirFiles) =>
  getLoadLinks.then((loadLinks) => {
    if (loadLinks.length === 0) {
      return [];
    }
    fs.mkdir(dirFiles);
    return Promise.all(loadLinks.map(({ link, localLink }) => {
      debug(`start load a file ${link}`);
      const getSaveLink = axios({
        method: 'get',
        url: link,
        responseType: 'arraybuffer',
      }).then(({ data }) => fs.writeFile(localLink, data));
      getSaveLink.then(() => debug(`end load a file ${link}`));
      return getSaveLink;
    }));
  });

export default async (url, dir) => {
  debug(`start load a page ${url}`);
  const catalog = catalogName(url);

  const getHtml = axios.get(url).then(res => res.data);
  getHtml.then(() => debug('html loaded'));

  const getLocalLinks = getHtml.then(html => uniq(getLinks(html).filter(isLocalLink)));
  getLocalLinks.then(localLinks => debug(`${localLinks.length} local links found`));

  const getExchangeLinks = getLocalLinks.then(localLinks =>
    localLinks.map(link => ({ link, localLink: getLocalLink(link, catalog) })));
  const getLocalHtml = Promise.all([getHtml, getExchangeLinks]).then(([html, exchangeLinks]) =>
    exchangeLinks.reduce((str, { link, localLink }) => str.replace(new RegExp(link, 'g'), localLink), html));
  const getSaveHtml = getLocalHtml.then(html => fs.writeFile(path.join(dir, pageName(url)), html));
  getSaveHtml.then(() => debug('html saved'));

  const dirFiles = path.join(dir, catalog);

  const getLoadLinks = getLocalLinks.then(localLinks =>
    localLinks.map(link => ({
      link: fullLink(link, url),
      localLink: getLocalLink(link, dirFiles),
    })));
  const getSaveLocalLinks = saveLocalLinks(getLoadLinks, dirFiles);

  const getLoadPage = Promise.all([getSaveHtml, getSaveLocalLinks])
    .catch((err) => {
      console.log(err);
    });
  getLoadPage.then(() => debug(`end load a page ${url}`));
  return getLoadPage;
};
