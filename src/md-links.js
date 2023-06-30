import { readFile, readdirSync } from "node:fs";

function readFiles (path){
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
readFiles('test.md');

function readDirectory(directoryPath){
  return new Promise((resolve, reject) => {
    try {
      const dirFiles = readdirSync(directoryPath);
      resolve(console.log(dirFiles));
    } catch (error) {
      reject(error);
    }
    
  });
};
readDirectory('./files')

