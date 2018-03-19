#!/usr/bin/env node
import program from 'commander';
import loader from '..';
import { version } from '../../package.json';

program
  .version(version)
  .arguments('<url>')
  .option('--output [dir]', 'Output dir', process.cwd())
  .action((url, options) => loader(url, options.output));

program.parse(process.argv);
