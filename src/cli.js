#! /usr/bin/env node

import { mdLinks } from "./md-links.js";
import chalk from 'chalk';

const path = process.argv[2];
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats'),
  validateAndStats: process.argv.includes('--validate') && process.argv.includes('--stats'),
}

function statsLinks(links){
  const linksSize = links.length;
  const uniqueLinks = [... new Set(links.map((link) => link.links))].length;
  const brokenLinks = links.filter((link) => link.ok === 'FAIL').length;
  return {
    total: linksSize,
    unique: uniqueLinks,
    broken: brokenLinks,
  };
}

mdLinks(path, options)
  .then((results) => {
    if (options.validateAndStats){
      const linkStats = statsLinks(results);
      console.log(chalk.green('Total links:' + linkStats.total));
      console.log(chalk.yellow('Unique links:' + linkStats.unique));
      console.log(chalk.red('Broken links:' + linkStats.broken));

    } else if (options.validate){
      results.forEach((link) => {
        console.log(chalk.yellow('File:' + link.file));
        console.log(chalk.magenta('Text:' + link.text));
        console.log(chalk.cyan('Link:' + link.links));
        
        if(link.ok === 'FAIL'){
          console.log(chalk.red('Status HTTP:' + link.status + ' ❌'))
          console.log(chalk.red('OK:' + link.ok + ' ❌'))
        } else {
          console.log(chalk.green('Status HTTP:' + link.status + ' ✔️'));
          console.log(chalk.green('OK:' + link.ok + ' ✔️'));
        }
        console.log('¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨')
      });

    } else if (options.stats){
      const linkStats = statsLinks(results);
      console.log(chalk.green('Total links:' + linkStats.total));
      console.log(chalk.yellow('Unique links:' + linkStats.unique));

    } else {
      results.forEach((link) => {
        console.log(chalk.yellow('File:' + link.file));
        console.log(chalk.magenta('Text:' + link.text));
        console.log(chalk.cyan('Link:' + link.links));
        console.log('¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨')      
      })
    }
  })
  .catch((error) => {
    console.error(error);
  });