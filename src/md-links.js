import { readFile, readdirSync, lstatSync } from "node:fs";
import fetch from 'cross-fetch';
import chalk from 'chalk';

// função para separar o texto do link e retirar os caracteres []()
function extractElements(string, file){
  const elements = string.split('](');
  const text = elements[0].replace('[', '');
  const links = elements[1].replace(')', '');
  const totalElements = {file, text, links};
  return totalElements;
}

//Função para validar os links utilizando o fetch
function validateLinks(links){
  const promises = links.map((link) => 
    fetch(link.links)
    .then((response) => {
      link.status = response.status;
      link.ok = response.ok ? 'OK' : 'FAIL';
      return link
    })
    .catch(() => {
      link.status = 404;
      link.ok = 'FAIL';
      return link;
    })
  )
  return Promise.all(promises);
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

//Função principal que le os arquivos, diretorio e extrai o link dos arquivos
function mdLinks(path, options){
  try {
    const stats = lstatSync(path);

    if (stats.isDirectory()){
      const files = readdirSync(path);
      const mdFiles = files.filter((file) => file.endsWith('.md'));
      const result = mdFiles.map((file) => {
        const fullPath = `${path}/${file}`;
        return mdLinks(fullPath, options); //chamada recursiva
      });
      return Promise.all(result).then((results) => [].concat(...results));
    }
    
    if (stats.isFile()){
      if (!path.endsWith('.md')){
        console.log(chalk.yellow('Nenhum arquivo md encontrado'));
      } else {
        return new Promise((resolve, reject) => {
          const linkRegex = /\[[^\]]+\]\(([^)]+)\)/gm;
          readFile(path, 'utf8', (err, data) => {
            if (err){
              reject(err.message);
            } else {
              const content = data.match(linkRegex);
              const element = content.map((text) => extractElements(text, path));
              validateLinks(element)
              .then((validatedLinks) => {
                if (options.validate){
                  resolve(validatedLinks);
                } else if (options.stats) {
                  const linkStats = statsLinks(validatedLinks);
                  resolve({ stats: linkStats });
                } else if (options.validate && options.stats) {
                  const linkStats = statsLinks(validatedLinks);
                  resolve({ links: validatedLinks, stats: linkStats });
                } else {
                  resolve(validateLinks(element))
                }
              })
              .catch((error) => {
                reject(error);
              });
            }
          });
        });
      }
    } else {
      console.error(chalk.red('Caminho inválido'));
    }
  } catch (err) {
    console.error(err.message);
  }
}

export { mdLinks, extractElements, validateLinks, statsLinks };