  var moment = require('moment-timezone');
  let timetxt = document.getElementById("time");
  setInterval(function() { 
      let now = moment().tz("America/New_York").format('hh:mm:ss')
      timetxt.innerHTML = now;
   }, 1000);
   