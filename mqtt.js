require('dotenv').config()

// add timestamps in front of log messages
var strftime = require('strftime') // not required in browsers
require('log-timestamp')(function() { 
  return '[' + strftime('%d-%m-%Y %H:%M:%S') + ']' })

console.log("=== Server startup ===")

// WEB SERVER SETUP
const express = require('express')
const webapp = express()
// const webport = process.env.webport

// URL FORMAT:
// http://localhost:1884/mqtt?t=/GarageDoor/Command&m=click&retain=true&qos=1
webapp.get('/mqtt', (req, res) => {
  let opts = {}
  if (req.query.qos>0)    { opts.qos = req.query.qos }
  if (req.query.retain) { opts.retain = req.query.retain }
  // console.log(opts)
  // console.log(client)
  console.log("webserver received " + req.url)
  client.publish(req.query.t, req.query.m, opts, function(err) {
    if (err) console.log(err)
    res.send('OK')
  })
})

webapp.listen(process.env.webport, () => {
  console.log(`Webserver listening at ${process.env.webport}`)
})



// SETUP THE AEDES MQTT SERVER
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
// const port = 1883

server.listen(process.env.mqttport, function () {
  console.log('MQTT server started and listening on port ', process.env.mqttport)
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
    // console.log(client)
    console.log(client.id + ' published ', pkt)
  } 
})

aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log(client.id + ' subscribed ', subscriptions)
  }
})

aedes.on('client', function (client) {
  console.log('new client', client.id)
})


aedes.authenticate = function (client, username, password, callback) {
  if( username == process.env.mqttuser && password == process.env.mqttpass) {
    // console.log("Client Authenticated Successfully")
    callback(null, true)
  } else {
    callback(null, false)
  }
}

// MQTT Client Connect for Express to talk to
var mqtt = require('mqtt')

var client  = mqtt.connect('mqtt://'+process.env.mqtthost, 
{ port: process.env.mqttport, 
  username: process.env.mqttuser, 
  password: process.env.mqttpass,
  connectTimeout: 100
} )

client.on('connect', function () {
  // console.log("MQTT Client connected to MQTT broker");
})

client.on('error', function (error) {
  console.log("MQTT client connect fail: " + error);
  // process.exit(1);
})
