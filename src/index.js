import axios from 'axios';
import fs from 'mz/fs';
import { getLinks, isLocalLink } from './parser';
import { getLocalLink, pageName, catalogName } from './names';

export default (url, dir) => {
  const catalog = catalogName(url);
  const getData = axios.get(url)
    .then((res) => {
      const html = res.data;
      // const exchangeLinks = getLinks(html)
      //   .filter(isLocalLink)
      //   .map(link => ({ link, localLink: getLocalLink(link, catalog) }));
      const exchangeLinks = getLinks(html)
        .reduce((acc, link) => {
          if (isLocalLink(link)) {
            const obj = ({ link, localLink: getLocalLink(link, catalog) });
            return acc.concat(obj);
            //acc.push(obj);
            //return acc;
          }
          return acc;
        }, []);
      return exchangeLinks.reduce((str, { link, localLink }) => str.replace(new RegExp(link, 'g'), localLink), html);
      //const arr = exchangeLinks.map(({ link, localLink }) => html.replace(new RegExp(link, 'g'), localLink));
    });
  // const getLocalLink = getData;
  // const getLocalHtml = getData;
  //   .then(res => fs.writeFile(`${dir}/${getName(url)}.html`, res.data))
  //   .catch((err) => {
  //     console.log(err);
  //   });
};
