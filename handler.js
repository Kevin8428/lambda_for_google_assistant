'use strict';
var https = require('https')

new Promise((resolve, reject) => {
    const options = {
        host: 'wfm-api-dev.dispatch.me',
        // path: '/v3/search/jobs?organization_id[]=11827&status[]=scheduled',
        path: '/v3/jobs/32566',
        headers: {
          'Authorization':'Bearer [bt]'
        },
        method: 'GET'
    }

    const req = https.request(options, (res) => {
      // console.log("success! data is: ", res)      
      res.on('data', (d) => {
        // process.stdout.write(d);
        resolve(d);      
      });
      
    });    

    req.on('error', (e) => {
      reject(e.message);
    }); 

    // send the request
    req.write('');
    req.end();
  }).then(res => {
    console.log(JSON.parse(res.toString())); 
  });
