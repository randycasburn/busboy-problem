const path = require('path');
const os = require('os');
const fs = require('fs');

const express = require('express');
const port = 3000;
const app = express();

const busboy = require('busboy');

const { v4: uuidv4 } = require('uuid');

app.post('/upload', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  const bb = busboy({ headers: request.headers });

  const uuid = uuidv4();
  const fileObject = {};

  bb.on('file', (_name, file, info) => {
    const { filename, mimeType } = info;

    let bytes = 0;
    file.on('data', (data) => {
      bytes += data.length;
      console.log(`Received ${(bytes / 1000000).toFixed(2)}MB`);
    });

    fileObject['mime'] = mimeType;
    fileObject['path'] = path.join(os.tmpdir(), `${uuid}.flac`);

    // This is where I suspect that the problem lies, as the stream does not always emit the 'close' event
    // Instead, createWriteStream() remains stuck indefinitely, waiting for data to be piped to the stream
    file.pipe(fs.createWriteStream(fileObject['path'])).on('close', (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`File was created: ${fileObject['path']}`);
      }
    });
  });

  // How come this event is emitted before createWriteStream() emits its 'close' event?
  bb.on('close', () => {
    console.log(`Actual size is ${(fs.statSync(fileObject['path']).size / 1000000).toFixed(2)}MB`);
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
