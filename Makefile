start:
	npm run babel-node -- 'src/bin/gendiff.js' __tests__/__fixtures__/before.json __tests__/__fixtures__/after.json

install:
	npm install

build:
	rm -rf dist
	npm run build

test:
	npm test

test-watch:
	npm test -- --watch

lint:
	npm run eslint .

publish:
	npm publish