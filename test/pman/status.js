const DocsBundle = require('../../src/DocsBundle');
const FormData = require('form-data');
const fs = require('fs');

const stream = process.stdout;
const baseUrl = 'http://127.0.0.1:5000/';

async function flow() {
  //const formData = new FormData();
  //formData.append('file', fs.createReadStream('../logo192.png'));
  //formData.append('statusContent', '완료');
  await DocsBundle({
    method: 'DELETE',
    url: '/api/v1/team/:teamID/schedule/:scheduleID/status',
    bind: {
      ':teamID': 3,
      ':scheduleID': 1,
    },
    //data: formData,
    baseUrl,
    stream,
  });
}
flow();
