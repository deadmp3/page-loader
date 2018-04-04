import cheerio from 'cheerio';

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

export default (html) => {
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
