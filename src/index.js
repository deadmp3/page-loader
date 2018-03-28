import axios from 'axios';
import fs from 'mz/fs';
import getLinks from './parser';
import { nativeLink, pageName, catalogName } from './names';

export default (url, dir) => {
  const catalog = catalogName(url);
  const getData = axios.get(url)
    .then((res) => {
      const { data } = res;
      const exchangeLinks = getLinks(data).map(link => ({ link, nativePath: nativeLink(link, catalog) }));
      return exchangeLinks.reduce((str, { link, nativePath }) => str.replace(new RegExp(link, 'g'), nativePath), data);
    });
  // const getLocalLink = getData;
  // const getLocalHtml = getData;
  //   .then(res => fs.writeFile(`${dir}/${getName(url)}.html`, res.data))
  //   .catch((err) => {
  //     console.log(err);
  //   });
};
