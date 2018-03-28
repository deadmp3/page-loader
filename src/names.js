import url from 'url';
import path from 'path';

const toKebabCase = str => str.replace(/(\/|\.)/g, '-');
const linkToNativeName = (link) => {
  const { hostName, pathName } = url.parse(link);
  const parsePath = path.parse(pathName);
  const pathWithoutExt = path.format({ ...parsePath, ext: '', base: '' });
  const body = toKebabCase(url.format({ hostName, pathName: pathWithoutExt }));
  return `${body}${parsePath.ext}`;
};
export const nativeLink = (link, catalog) => path.join(catalog, linkToNativeName(link));
export const pageName = page => `${toKebabCase(page)}.hmtl`;
export const catalogName = page => `${toKebabCase(page)}_files`;
