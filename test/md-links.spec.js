const { describe, it, expect } = require ('@jest/globals');

// const mdLinks = require('../src/md-links');
import { mdLinks, extractElements } from '../src/md-links'

describe('mdLinks', () => {
  it('should be a function', () => {
    expect(typeof mdLinks).toBe('function');
  });
}); 

describe('extractElements', () => {
  it('should be a function', () => {
    expect(typeof extractElements).toBe('function');
  });
});