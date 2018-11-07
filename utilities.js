var https = require('https')
var querystring = require('querystring');


/**
 * returns 11:00 AM format
 * @param {Date} date 
 */
function displayNiceTime(date) {
  // getHours returns the hours in local time zone from 0 to 23
  var hours = date.getHours()
  // getMinutes returns the minutes in local time zone from 0 to 59
  var minutes = date.getMinutes()
  var meridiem = " AM"

  // convert to 12-hour time format
  if (hours > 12) {
    hours = hours - 12
    meridiem = ' PM'
  }
  else if (hours === 0) {
    hours = 12
  }

  // minutes should always be two digits long
  if (minutes < 10) {
    minutes = "0" + minutes.toString()
  }
  return hours + ':' + minutes + meridiem
}

/**
 * takes an appointment
 * returns: address and time
 * @param {object} appointment 
 */
function getAppointmentInfo(appointment) {
  const address = appointment.address;
  const time = new Date(appointment.time);

  // address format: 100 Street City Name, State ZipCode
  const full_address = `${address.street_1} ${address.city}, ${address.state} ${address.postal_code}`;


  // day: November 2
  var optionsDay = { month: 'long', day: 'numeric' };
  const day = time.toLocaleDateString('en-US', optionsDay);

  // hour: 3:00 PM
  const hour = displayNiceTime(time);

  return { address: full_address, day, hour };
}

function displayNiceLocationAndTime({ address, day, hour }) {
  return `Your appointment is at ${address} on ${day} at ${hour}`;
}

/**
 * takes response from appointments api
 * returns: first scheduled appointment
 * @param {object} response 
 */
function getFirstAppointment(response) {
  // maybe some fancy logic here in the future
  return response.appointments[0];
}


/**
 * 
 * returns promise with data as a json
 * @param {string} host
 * @param {srting} path 
 * @param {string} bearer 
 */
function getDispatchAsync(host, path, bearer) {
  return new Promise((resolve, reject) => {
    const options = {
      host,
      path,
      headers: {
        'Authorization': `Bearer ${bearer}`
      },
      method: 'GET'
    }

    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        resolve(JSON.parse(d.toString()));
      });
    });
    req.on('error', (e) => {
      reject(e.message);
    });
    // send the request
    req.write('');
    req.end();
  })
}

/**
 *  complete job
 */
function completeDispatchJob(jobId, bearer) {
  var postData = querystring.stringify({
    'status': 'complete'
  });

  return new Promise((resolve, reject) => {
    const options = {
      host: 'wfm-api-dev.dispatch.me',
      path: `/v3/jobs/${jobId}`,
      headers: {
        'Authorization': `Bearer ${bearer}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      },
      method: 'PATCH'
    }

    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        resolve(JSON.parse(d.toString()));
      });
    });

    req.on('error', (e) => {
      reject(e.message);
    });

    // send the request
    req.write(postData);
    req.end();
  })
}

function updateDispatchJob(jobId, bearer, status) {
  var postData = querystring.stringify({
    'status': status
  });

  return new Promise((resolve, reject) => {
    const options = {
      host: 'wfm-api-dev.dispatch.me',
      path: `/v3/jobs/${jobId}`,
      headers: {
        'Authorization': `Bearer ${bearer}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      },
      method: 'PATCH'
    }

    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        resolve(JSON.parse(d.toString()));
      });
    });

    req.on('error', (e) => {
      reject(e.message);
    });

    // send the request
    req.write(postData);
    req.end();
  })
}

function updateDispatchAppt(apptId, bearer, status) {
  var postData = querystring.stringify({
    'status': status
  });

  return new Promise((resolve, reject) => {
    const options = {
      host: 'wfm-api-dev.dispatch.me',
      path: `/v1/appointments/${apptId}`,
      headers: {
        'Authorization': `Bearer ${bearer}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      },
      method: 'PATCH'
    }

    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        resolve(JSON.parse(d.toString()));
      });
    });

    req.on('error', (e) => {
      reject(e.message);
    });

    // send the request
    req.write(postData);
    req.end();
  })
}

function getUserInfo(userId, bearer) {

  return new Promise((resolve, reject) => {
    const options = {
      host: 'wfm-api-dev.dispatch.me',
      path: `/v1/users/${userId}`,
      headers: {
        'Authorization': `Bearer ${bearer}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      },
      method: 'GET'
    }

    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        resolve(JSON.parse(d.toString()));
      });
    });

    req.on('error', (e) => {
      reject(e.message);
    });

    // send the request
    req.write(postData);
    req.end();
  })
}


function getLocInfo(lat, lng, token) {

  return new Promise((resolve, reject) => {
    const options = {
      host: 'wfm-api-dev.dispatch.me',
      path: `/v1/users/${userId}`,
      headers: {
        'Authorization': `Bearer ${bearer}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      },
      method: 'GET'
    }

    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        resolve(JSON.parse(d.toString()));
      });
    });

    req.on('error', (e) => {
      reject(e.message);
    });

    // send the request
    req.write(postData);
    req.end();
    
  })
}

exports.getAppointmentInfo = getAppointmentInfo;
exports.getFirstAppointment = getFirstAppointment;
exports.getDispatchAsync = getDispatchAsync;
exports.displayNiceLocationAndTime = displayNiceLocationAndTime;
exports.completeDispatchJob = completeDispatchJob;
exports.updateDispatchJob = updateDispatchJob;
exports.updateDispatchAppt = updateDispatchAppt;
exports.getUserInfo = getUserInfo;
exports.getLocInfo = getLocInfo;