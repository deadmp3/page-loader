import url from 'url';
import path from 'path';

export const isLocalLink = link => !url.parse(link).hostname;
export const fullLink = (link, page) => {
  if (isLocalLink(link)) {
    return url.format({ ...url.parse(page), pathname: link });
  }
  return link;
};

const toKebabCase = str => str
  .replace(/\W*(.*)/g, '$1')
  .replace(/\W/g, '-');
const linkToLocal = (link) => {
  const { hostname, pathname } = url.parse(link);
  const parsePath = path.parse(pathname);
  const pathWithoutExt = path.format({ ...parsePath, ext: '', base: '' });
  const body = toKebabCase(url.format({ hostname, pathname: pathWithoutExt }));
  return `${body}${parsePath.ext}`;
};
export const getLocalLink = (link, catalog) => path.join(catalog, linkToLocal(link));
export const pageName = page => `${linkToLocal(page)}.html`;
export const catalogName = page => `${linkToLocal(page)}_files`;
