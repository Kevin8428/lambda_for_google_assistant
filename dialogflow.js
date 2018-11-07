const { dialogflow } = require('actions-on-google');
const app = dialogflow();
var https = require('https');
var utilities = require ('./utilities.js')

app.intent('next-job-intent', conv => {
  
  return new Promise((resolve, reject) => {
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
    const r = JSON.parse(res.toString())
    console.log("result: ", r) 
    console.log("result id: ", r.id) 
    conv.ask(r.customer.full_name)
  });
})

app.intent('next-appointment-mock', conv => {
  console.log(conv.parameters)
  conv.ask('your next appointment is at 123 north washington street with Avi Goldberg. Would you like me to complete your last appointment, and let Avi know you are on your way?')
})

app.intent('next-appointment-mock-action-confirmation', conv => {
  conv.ask('Got it, Ive completed your appointment and let Avi know you are on your way.')
})

app.intent('next-appointment-location-mock', conv => {
  console.log(conv.parameters)
  conv.ask('your next appointment is at 11 am today with Avi Goldberg. Based on your current location and traffic, looks like you will be running late. Would you like me to send a text to Avi to let him know?')
})

app.intent('next-appointment-location-mock-action-confirmation', conv => {  
  conv.ask('Ok, I let Avi know you are running late.')
})

app.intent('dispatcher-mock', conv => {
  console.log(conv.parameters)
  conv.ask('Yes, it looks like David is running behind schedule and will not make his appointment with James Smith. Would you like me to connect you with James?')
})

app.intent('dispatcher-connect-mock', conv => {  
  conv.ask('OK, calling James Smiths cell.')
})

app.intent('get-appointment-confirmation', conv => {
  // mark first job as complete
  return utilities.updateDispatchJob(32860, '[bt]', 'complete').
  then(() => {
    // mark second appointment as enroute
    return utilities.updateDispatchAppt(20752,'[bt]', 'enroute').then(() => {
      conv.ask('Got it, Ive completed your appointment.');
    });
  });  
})

app.intent('get-appointment', conv => {
  return utilities.getDispatchAsync(
    'wfm-api-dev.dispatch.me',
    '/v3/jobs/32861', // id needs to be second job id
    '[bt]'
  ).then(job => {
  
    return utilities.getDispatchAsync(
      'wfm-api-dev.dispatch.me',
      '/v1/appointments?filter[job_id_eq]=32861', // id needs to be second job id
      '[bt]'
    ).then(appointments => {
  
      const apt = utilities.getFirstAppointment(appointments);
      const info = utilities.getAppointmentInfo(apt);
      const locationAndTime = utilities.displayNiceLocationAndTime(info);
      conv.ask(`${locationAndTime} with ${job.customer.first_name} ${job.customer.last_name}. Would you like me to complete you current job and let ${job.customer.first_name} know you are on your way?`)
    })
  })
})

app.intent('get-user-loc', conv => {
  return utilities.getUserLoc('6680',  //technicians id
    '[bt]'
  ).then(user => {
    return getLocInfo(user.lat, user.lng, TOKEN).then(landmark => {
      conv.ask(`Yes, It looks like ${user.first_name} is near ${landmark.thing}. Do you want me to connect you with them?`)
    })
  })
})

app.intent('', conv => {
  
})

exports.fulfillment = app;