import { readFile } from "node:fs";

function mdLinks (path, options) {
  return new Promise((resolve, reject) => {
    readFile(path, 'utf8', (err, data) => {
      if (err){
        reject(err.message)
      } else{
        resolve(console.log(data));
      }
    })
  });
};
mdLinks("test.md");

// export { mdLinks };