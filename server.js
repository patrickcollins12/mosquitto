// TODO: MQTT server needs auth
// MQTT CLIENT SETUP
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

// WEB SERVER SETUP
const express = require('express')
const webapp = express()
const webport = 1884

webapp.get('/GarageOpen', (req, res) => {
  res.send('Garage Opening')
  client.publish('/GarageDoor/Action', 'open')
})
webapp.get('/GarageClose', (req, res) => {
  res.send('Garage Closing')
  client.publish('/GarageDoor/Action', 'close')
})
webapp.get('/GarageClick', (req, res) => {
  res.send('Garage Click')
  client.publish('/GarageDoor/Action', 'click')
})

webapp.listen(webport, () => {
  console.log(`Webserver listening at ${webport}`)
})

// SETUP THE AEDES MQTT SERVER
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
// const port = 1883

server.listen(mqttport, function () {
  console.log('MQTT server started and listening on port ', mqttport)
})

aedes.on('clientError', function (client, err) {
  console.log('client error', client.id, err.message, err.stack)
})

aedes.on('connectionError', function (client, err) {
  console.log('client error', client, err.message, err.stack)
})

aedes.on('publish', function (packet, client) {
  if (client) {
    pkt = {topic: packet.topic, payload: packet.payload.toString()}
    if (packet.qos) { pkt.qos = packet.qos}
    if (packet.retain) { pkt.retain = packet.retain}
    console.log('message from client', pkt)
  }
})

aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log('subscribe from client', subscriptions, client.id)
  }
})

aedes.on('client', function (client) {
  console.log('new client', client.id)
})


aedes.authenticate = function (client, username, password, callback) {
  if( username == mqttuser && password == mqttpass) {
    // console.log("Client Authenticated Successfully")
    callback(null, true)
  }
}
