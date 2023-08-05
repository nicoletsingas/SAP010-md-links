import { readFile, readdirSync, lstatSync } from "node:fs";
import fetch from 'cross-fetch';

export function extractElements(string, file){
  const elements = string.split('](');
  const text = elements[0].replace('[', '');
  const links = elements[1].replace(')', '');
  const totalElements = {file, text, links};
  return totalElements;
}

export function validateLinks(links){
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

export function mdLinks(path, options){
  try {
    const stats = lstatSync(path);

    if (stats.isDirectory()){
      const files = readdirSync(path);
      const mdFiles = files.filter((file) => file.endsWith('.md'));
      const subDirectories = files.filter((file) => lstatSync(`${path}/${file}`).isDirectory());

      const result = mdFiles.map((file) => {
        const fullPath = `${path}/${file}`;
        return mdLinks(fullPath, options);
      });

      const subDirectoryResults = subDirectories.map((subDir) => {
        const subDirPath = `${path}/${subDir}`;
        return mdLinks(subDirPath, options);
      })

      const combinedResults = result.concat(subDirectoryResults);

      const emptyArray = [];
      return Promise.allSettled(combinedResults).then((results) => 
        results.reduce((accumulator, resultObj) => {
          if (resultObj.status === 'fulfilled'){
            return accumulator.concat(resultObj.value);
          } else {
            console.log(resultObj.reason);
            return accumulator;
          }
        }, emptyArray) 
      );
    }
    
    if (stats.isFile()){
      if (!path.endsWith('.md')){
        console.log('Nenhum arquivo md encontrado');
      } else {
        return new Promise((resolve, reject) => {
          readFile(path, 'utf8', (err, data) => {
            if (err){
              reject('Erro ao ler arquivo');
            } else {
              if (data.trim() === ''){
                reject(`File: ${path}: O arquivo md está vazio `);
                return;
              }
              const linkRegex = /\[[^\]]+\]\(([^)]+)\)/gm;
              const content = data.match(linkRegex);
              const element = content.map((text) => extractElements(text, path));
              if (options.validate){
                validateLinks(element)
                .then((validatedLinks) => {
                  resolve(validatedLinks);
                })
                .catch((error) => {
                  reject(error);
                });
              } else {
                resolve(element);
              }
            }
          });
        })
      }
    } else {
      console.error('Caminho inválido');
    }
  } catch (err) {
    console.error(err.message);
  }
}
