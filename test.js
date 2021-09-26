var mqtt = require('mqtt')
const mqtthost = 'localhost'
const mqttport = 1883
const mqttuser = "patrick"
const mqttpass = "patrick2"

var client  = mqtt.connect('mqtt://'+mqtthost, 
  { port: mqttport, 
    username: mqttuser, 
    password:mqttpass,
    connectTimeout: 100
  } )

client.on('connect', function () {
  console.log("MQTT Client connected to MQTT broker");
})

client.on('error', function (error) {
  console.log("MQTT client connect fail: " + error);
  // process.exit(1);
})

let topics = {};
client.on('message', function (topic, message) {
  // message is Buffer
  let m = message.toString();
  console.log(topic, " ", m)
  // topics[topic] = m;
  
  // client.end()
})
  
// client.publish("/Status", "open 1", {qos:2, retain:1}, function(err) {
//   if (err) console.log(err)
//   console.log('published 1')
// })


// var waitTill = new Date(new Date().getTime() + 1 * 1000);
// while(waitTill > new Date()){}


client.subscribe("/Status", {qos:1}, function(err) {
  if (err) console.log(err)
})


// var waitTill = new Date(new Date().getTime() + 1 * 1000);
// while(waitTill > new Date()){}


// client.publish("/Status", "open 2", {qos:2, retain:1}, function(err) {
//   if (err) console.log(err)
//   console.log('published 2')
// })

// client.end()