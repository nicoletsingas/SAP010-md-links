import { describe, it, expect, } from '@jest/globals';
import { mdLinks, extractElements, validateLinks, statsLinks } from '../src/md-links';

const mockData = [
  {
    file: 'exemplo.md', 
    text: 'Exemplo',
    links: 'https://pt.wikipedia.org/wiki/Markdown',
  },
  {
    file: 'exemplo.md', 
    text: 'One Piece',
    links: 'https://onepieceex.net/',
  }
];

describe('extractElements', () => {
  it('should be a function', () => {
    expect(typeof extractElements).toBe('function');
  });

  it('Should correctly extract the elements', () => {
    const file = 'arquivos.md';
    const string = '[Exemplo](https://teste.com.br)';
    const result = extractElements(string, file);
    expect(result.file).toEqual(file);
    expect(result.text).toEqual('Exemplo');
    expect(result.links).toEqual('https://teste.com.br')
  });
});

describe('validateLinks', () => {
  it('should return status "ok" after validate a valid link',  async () => {
    const links = [
      { link: 'https://exemplo.com/valido' },
      { link: 'https://exemplo.com/invalido' },
    ];
    await validateLinks(links)
    .then((response) => {
      expect(response).toEqual([
        {
          link: 'https://exemplo.com/valido',
          status: 200,
          ok: 'OK',
        },
        {
          link: 'https://exemplo.com/invalido',
          status: 404,
          ok: 'FAIL',
        }
      ]);
    })
    .catch((error) => {
      error.message;
    });
  });
});

describe('statsLinks', () => {
  it('should return informations about total, unique and broken links when its --stats', () => {
    const options = {
      validate: false,
      stats: true,
    }
    const result = {
      total: 2,
      unique: 2,
      broken: 0,
    }
    const res = statsLinks(mockData, options);
    expect(res).toEqual(result);
  });
});

describe('mdLinks', () => {
  it('should be a function', () => {
    expect(typeof mdLinks).toBe('function');
  });

  it('should return properties of a valid diretory', () => {
   const path = './src/files'
   const options = {};
   const result = mdLinks(path, options);
   return result.then((links) => {
    links.forEach((link) => {
      expect(link).toHaveProperty('links');
      expect(link).toHaveProperty('text');
      expect(link).toHaveProperty('file');
    });
   });
  });
    
  it('should return links informations when its --validate', async () => {
    const resultexpected = [
      {
        file: './src/files/file.md',
        text: 'Markdown',
        links: 'https://pt.wikipedia.org/wiki/Markdown',
        status: 200,
        ok: 'OK',
      },
      {
        file: './src/files/file.md',
        text: 'Documentação Node.js',
        links: 'https://nodejs.org/api/fs.html#fsreaddirsyncpath-options',
        status: 200,
        ok: 'OK',
      },
      {
        file: './src/files/file.md',
        text: 'Regex',
        links: 'https://regexr.com/',
        status: 200,
        ok: 'OK',
      },
      {
        file: './src/files/file.md',
        text: 'EcmaScript Modules',
        links: 'https://blog.lsantos.dev/os-ecmascript-modules-estao-aqui/',
        status: 200,
        ok: 'OK',
      },
      {
        file: './src/files/file.md',
        text: 'JavaScript W3Schools',
        links: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript',
        status: 200,
        ok: 'OK',
      },
      {
        file: './src/files/file.md',
        text: 'Broken URL',
        links: 'httpshsdjhsjd://teste.com.br',
        status: 404,
        ok: 'FAIL',
      },
    ];
    const result = await mdLinks('./src/files/file.md', {validate: true})
    expect(result).toEqual(resultexpected)
  })
  
  it('should return informations about total and unique links when its --stats', async () => {
    const resultexpected = { stats: { total: 6, unique: 6, broken: 1 }};
    const result = await mdLinks('./src/files/file.md', {stats: true});
    expect(result).toEqual(resultexpected);
  });

  it('should return informations about total, unique and broken links when its --validade and --stats', async () => {
    const resultExpected = [
        {
          file: './src/files/file.md',
          text: 'Markdown',
          links: 'https://pt.wikipedia.org/wiki/Markdown',
          status: 200,
          ok: 'OK',
        },
        {
          file: './src/files/file.md',
          text: 'Documentação Node.js',
          links: 'https://nodejs.org/api/fs.html#fsreaddirsyncpath-options',
          status: 200,
          ok: 'OK',
        },
        {
          file: './src/files/file.md',
          text: 'Regex',
          links: 'https://regexr.com/',
          status: 200,
          ok: 'OK',
        },
        {
          file: './src/files/file.md',
          text: 'EcmaScript Modules',
          links: 'https://blog.lsantos.dev/os-ecmascript-modules-estao-aqui/',
          status: 200,
          ok: 'OK',
        },
        {
          file: './src/files/file.md',
          text: 'JavaScript W3Schools',
          links: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript',
          status: 200,
          ok: 'OK',
        },
        {
          file: './src/files/file.md',
          text: 'Broken URL',
          links: 'httpshsdjhsjd://teste.com.br',
          status: 404,
          ok: 'FAIL',
        },
      ];
    const result = await mdLinks('./src/files/file.md', {validate: true, stats: true});
    expect(result).toEqual(resultExpected);
  });
}); 