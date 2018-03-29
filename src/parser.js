import cheerio from 'cheerio';
import url from 'url';

const sourcesTag = [
  {
    tag: 'script',
    src: 'src',
  },
  {
    tag: 'link',
    src: 'href',
  },
  {
    tag: 'img',
    src: 'src',
  },
];

export const isLocalLink = link => !url.parse(link).hostname;

export const getLinks = (html) => {
  const arr = [];
  const $ = cheerio.load(html);
  sourcesTag.forEach(({ tag, src }) =>
    $(tag).each((i, element) => {
      const s = $(element).attr(src);
      if (s) {
        arr.push(s);
      }
    }));
  return arr;
};
