const { describe, it, expect, } = require ('@jest/globals');

import { mdLinks, extractElements, validateLinks, statsLinks } from '../src/md-links'

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
  it('should correctly validate the links',  async () => {
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
  it('Should return informations about total, unique and broken links when its --stats', () => {
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


  
}); 