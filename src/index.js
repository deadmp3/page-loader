import axios from 'axios';
import fs from 'mz/fs';
import path from 'path';
import getLinks from './parser';
import { getLocalLink, pageName, catalogName, isLocalLink, fullLink } from './names';

const saveLocalLinks = (getLoadLinks, dirFiles) =>
  getLoadLinks.then((loadLinks) => {
    if (loadLinks.length === 0) {
      return [];
    }
    fs.mkdir(dirFiles);
    return Promise.all(loadLinks.map(({ link, localLink }) =>
      axios({
        method: 'get',
        url: link,
        responseType: 'arraybuffer',
      }).then(({ data }) => fs.writeFile(localLink, data))));
  });

export default (url, dir) => {
  const catalog = catalogName(url);

  const getHtml = axios.get(url).then(res => res.data);
  const getLocalLinks = getHtml.then(html =>
    getLinks(html).filter(isLocalLink));
  const getExchangeLinks = getLocalLinks.then(localLinks =>
    localLinks.map(link => ({ link, localLink: getLocalLink(link, catalog) })));
  const getLocalHtml = Promise.all([getHtml, getExchangeLinks]).then(([html, exchangeLinks]) =>
    exchangeLinks.reduce((str, { link, localLink }) => str.replace(new RegExp(link, 'g'), localLink), html));
  const getSaveHtml = getLocalHtml.then(html => fs.writeFile(path.join(dir, pageName(url)), html));

  const dirFiles = path.join(dir, catalog);
  const getLoadLinks = getLocalLinks.then(localLinks =>
    localLinks.map(link => ({
      link: fullLink(link, url),
      localLink: getLocalLink(link, dirFiles),
    })));
  const getSaveLocalLinks = saveLocalLinks(getLoadLinks, dirFiles);

  return Promise.all([getSaveHtml, getSaveLocalLinks])
    .catch((err) => {
      console.log(err);
    });
};
