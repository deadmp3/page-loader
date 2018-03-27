import axios from 'axios';
import fs from 'mz/fs';
import { URL } from 'url';

const getName = (url) => {
  const myURL = new URL(url);
  return `${myURL.hostname}${myURL.pathname}`
    .replace(/(\/|\.)/g, '-');
};

export default (url, dir) =>
  axios.get(url)
    .then(res => fs.writeFile(`${dir}/${getName(url)}.html`, res.data))
    .catch((err) => {
      console.log(err);
    });
