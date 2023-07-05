#! /usr/bin/env node

import { mdLinks } from "./md-links.js";

const path = process.argv[2];

mdLinks(path)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
