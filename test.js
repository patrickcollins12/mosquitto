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

  client.publish("/Test/", "message", {qos:2, retain:1}, function(err) {
    if (err) console.log(err)
  })

  