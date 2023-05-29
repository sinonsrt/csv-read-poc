import { Readable } from 'stream';
import { createInterface } from 'readline';
import fs from 'fs';

(async () => {
  console.log('Start');

  console.log('Reading file...');
  const read = fs.readFileSync('./data/mockup.csv');

  const readableFile = new Readable();
  readableFile.push(read);
  readableFile.push(null);

  console.log('Creating Interface...');

  const dataLine = createInterface({
    input: readableFile,
    output: process.stdout,
    terminal: false,
  });

  console.log('Finished...');

  const lines: string[] = [];
  const formattedArray: any[] = [];
  let objectKeys: any;

  await new Promise((resolve, reject) => {
    dataLine
      .on('line', (line) => lines.push(line))
      .on('close', async () => {
        for (const [index, line] of lines.entries()) {
          const spplitedLine = line.split(';');

          if (index === 0) {
            objectKeys = spplitedLine;
          } else {
            const value = spplitedLine.reduce(
              (obj: any, key: any, index: number) => {
                obj[objectKeys[index]] = key;
                return obj;
              },
              {}
            );

            formattedArray.push(value);
          }
        }

        resolve(formattedArray);
      })
      .on('error', () => reject());
  });

  console.log(formattedArray);
  return formattedArray;
})();
