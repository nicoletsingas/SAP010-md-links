// Verifica se o caminho especificado é um diretório
const isDirectory = (path) => lstatSync(path).isDirectory();

// Verifica se o caminho especificado é um arquivo
const isFile = (path) => lstatSync(path).isFile();

// Função para extrair informações de uma string
const extrairInformacoes = (string, arquivo) => {
  // Divide a string em duas partes: texto e link
  const informacoes = string.split('](');
  // Remove os caracteres "[" do início do texto
  const texto = informacoes[0].replace('[', '');
  // Remove os caracteres ")" do final do link
  const link = informacoes[1].replace(')', '');
  // Retorna um objeto com as informações extraídas
  return {
    arquivo,
    link,
    texto,
  };
};

// Função principal para buscar links em arquivos Markdown
const mdLinks = (caminhoDoArquivo, options) => {
  if (!caminhoDoArquivo) throw new Error('Parâmetro inválido');

  // Verifica se o caminho se refere a um diretório
  if (isDirectory(caminhoDoArquivo)) {
    // Lê todos os arquivos do diretório
    const arquivos = readdirSync(caminhoDoArquivo);
    // Filtra os arquivos que possuem extensão .md (Markdown)
    const arquivosMarkdown = arquivos.filter((arquivo) => arquivo.endsWith('.md'));

    // Cria um array de promises para processar cada arquivo Markdown
    const promises = arquivosMarkdown.map((arquivo) => {
      // Obtém o caminho completo do arquivo
      const caminhoCompleto = `${caminhoDoArquivo}/${arquivo}`;
      // Chama recursivamente a função mdLinks para processar o arquivo
      return mdLinks(caminhoCompleto, options);
    });

    // Retorna uma Promise que aguarda a resolução de todas as promises dos arquivos Markdown
    return Promise.all(promises).then((resultados) => [].concat(...resultados));
  }

  // Verifica se o caminho se refere a um arquivo
  if (isFile(caminhoDoArquivo)) {
    // Verifica se o arquivo possui extensão .md (Markdown)
    if (!caminhoDoArquivo.endsWith('.md')) {
      console.error('O caminho especificado não se refere a um arquivo Markdown');
    }

    // Retorna uma nova Promise para processar o arquivo
    return new Promise((resolve, reject) => {
      const encode = 'utf-8';
      const regex = /\[[^\]]+\]\(([^)]+)\)/gm;

      // Lê o conteúdo do arquivo
      readFile(caminhoDoArquivo, encode, (err, data) => {
        if (err) throw reject(err);

        // Encontra todas as ocorrências de links no conteúdo do arquivo
        const conteudo = data.match(regex);
        // Extrai as informações de cada link encontrado
        const informacoes = conteudo.map((item) => extrairInformacoes(item, caminhoDoArquivo));

        // Verifica se a opção 'validate' está ativada
        if (options.validate) {
          // Faz uma requisição para cada link encontrado para obter o status e a mensagem
          Promise.all(informacoes.map((item) => fetch(item.link)
            .then((res) => {
              item.status = res.status;
              if (res.status !== 200) {
                item.message = 'FAIL';
              } else {
                item.message = res.statusText;
              }
              return item;
            })
            .catch((error) => {
              item.status = error;
              item.message = 'Esse link não existe';
              return item;
            })))
            .then(resolve);
        } else {
          // Retorna as informações dos links encontrados
          resolve(informacoes);
        }
      });
    });
  }
};