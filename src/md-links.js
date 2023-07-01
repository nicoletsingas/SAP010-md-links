import { readFile, readdirSync, lstatSync } from "node:fs";

const isDirectory = (path) => lstatSync(path).isDirectory(); //Verifica se o caminho é um diretorio
export const isFile = (path) => lstatSync(path).isFile();

function extractElements(string, file){
  const elements = string.split('](');
  const text = elements[0].replace('[', '');
  const links = elements[1].replace(')', '');
  return {file, text, links}; //possuem a mesma chave e valor
}

// função que busca os links nos arquivos md
function mdLinks(path, options){
  if (isDirectory(path)){
    const files = readdirSync(path);
    const mdFiles = files.filter((file) => file.endsWith('.md'));
    
    const result = mdFiles.map((file) => {
    const fullPath = `${path}/${file}`;
    return mdLinks(fullPath, options);
  });
    return Promise.all(result).then((results) => [].concat(...results));
  }

   if (isFile(path)){
    if (!path.endsWith('.md')){
      console.error('Nao foi encontrado nenhum arquivo md');
      return;
    }

    return new Promise((resolve, reject) => {
      const linkRegex = /\[[^\]]+\]\(([^)]+)\)/gm;

      readFile(path, 'utf8', (err, data) => {
        if (err){
          reject(err.message)
        } else{
          const content = data.match(linkRegex);
          const element = content.map((text) => extractElements (text, path));
          if (options.validate){
            resolve(console.log(element));
          }else{
            resolve(console.log(element));
          }
        }
      });
    });
  }
};

mdLinks('./files', { validate: true })