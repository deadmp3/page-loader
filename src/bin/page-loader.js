#!/usr/bin/env node
import program from 'commander';
import pageLoader from '..';
import { version } from '../../package.json';

program
  .version(version)
  .arguments('<url>')
  .option('--output [dir]', 'Output dir', '/var/tmp')
  .action((url, options) => {
    pageLoader(url, options.output);
  });

program.parse(process.argv);
