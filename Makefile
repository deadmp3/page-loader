start:
	npm run babel-node -- 'src/bin/page-loader.js' --output /home/deadmp3/projects/page-loader/tmp https://hexlet.io/courses

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
	npm run eslint src __test__

publish:
	npm publish