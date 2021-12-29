const path = require('path');
const os = require('os');
const fs = require('fs');
const busboy = require('busboy');
const express = require('express');
const port = 3000;
const app = express();

app.post('/upload', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  const bb = busboy({ headers: request.headers });
  const fileObject = {};
  let bytes = 0;
  bb.on('file', (name, file, info) => {
    const { filename, mimeType } = info;
    fileObject['mimeType'] = mimeType;
    fileObject['filePath'] = path.join(os.tmpdir(), filename);
    const saveTo = path.join(os.tmpdir(), filename);
    const writeStream = fs.createWriteStream(saveTo);
    file.on('data', (data) => {
      writeStream.write(data);
      console.log(`Received: ${((bytes += data.length) / 1000000).toFixed(2)}MB`);
    });
    file.on('end', ()=>{ console.log('closing writeStream'); writeStream.close()});
  });
  bb.on('close', () => {
    console.log(`Actual size is ${(fs.statSync(fileObject.filePath).size / 1000000).toFixed(2)}MB`);
    console.log('This is where the file would be uploaded to some cloud storage server...');
    response.send('File was uploaded');
  });
  bb.on('error', (error) => {
    console.log(error);
  });
  request.pipe(bb);
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
