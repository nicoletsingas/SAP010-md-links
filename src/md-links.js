import { readFile, readdirSync, lstatSync } from "node:fs";
// função para separar o texto do link e retirar os caracteres []()
function extractElements(string, file){
  const elements = string.split('](');
  const text = elements[0].replace('[', '');
  const links = elements[1].replace(')', '');
  return {file, text, links};
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
        console.error('Nenhum arquivo md encontrado');
      } else {
        return new Promise((resolve, reject) => {
          const linkRegex = /\[[^\]]+\]\(([^)]+)\)/gm;
          readFile(path, 'utf8', (err, data) => {
            if (err){
              reject(err.message);
            } else {
              const content = data.match(linkRegex);
              const element = content.map((text) => extractElements(text, path));
              if (options.validate){
                resolve(console.log(element));
              }
            }
          });
        });
      }
    } else {
      console.error('Caminho inválido');
    }
  } catch (err) {
    console.error(err.message);
  }
}

mdLinks('files', { validate: true });

export { mdLinks, extractElements };