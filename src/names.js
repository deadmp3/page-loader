import url from 'url';
import path from 'path';

const toKebabCase = str => str.replace(/(\/|\.)/g, '-');
const linkToLocal = (link) => {
  const { hostname, pathname } = url.parse(link);
  const parsePath = path.parse(pathname);
  const pathWithoutExt = path.format({ ...parsePath, ext: '', base: '' });
  const body = toKebabCase(url.format({ hostname, pathname: pathWithoutExt }));
  return `${body}${parsePath.ext}`;
};
export const getLocalLink = (link, catalog) => path.join(catalog, linkToLocal(link));
export const pageName = page => `${toKebabCase(page)}.hmtl`;
export const catalogName = page => `${toKebabCase(page)}_files`;
