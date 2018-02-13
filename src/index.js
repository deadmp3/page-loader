import axios from 'axios';
import fs from 'mz/fs';

export default (url, dir) =>
  axios.get(url)
    .then(res => fs.writeFile(`${dir}/index.html`, res.data))
    .catch((err) => {
      console.log(err);
    });
