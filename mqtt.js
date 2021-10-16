// get passwords and config from .env file
require('dotenv').config()


// add timestamps in front of log messages
var strftime = require('strftime') // not required in browsers
require('log-timestamp')(function() { 
  return '[' + strftime('%d-%m-%Y %H:%M:%S') + ']' })

console.log("=== Server startup ===")

///////////////////////////////////////////////
// MQTT Client Connect for Express to talk to
var mqtt = require('mqtt')

var client  = mqtt.connect('mqtt://'+process.env.mqtthost, 
{ port: process.env.mqttport, 
  username: process.env.mqttuser, 
  password: process.env.mqttpass,
  connectTimeout: 1000
} )

client.on('connect', function () {
  // console.log("MQTT Client connected to MQTT broker");
})

client.on('error', function (error) {
  console.log("MQTT client connect fail: " + error);
  // process.exit(1);
})

// subscribe to all messages
client.subscribe('#', {qos:1}, function(err) {
  if (err) console.log(err)
})

let topics = {};
client.on('message', function (topic, message) {
  // message is Buffer
  let m = message.toString();
  topics[topic] = m;
  console.log("Message received: " + topic + ": " + m)
})


///////////////////////////////////////////////
// WEB SERVER SETUP
const express = require('express')
// var morgan = require('morgan')

const webapp = express()
// webapp.use(morgan('combined'))
webapp.disable('x-powered-by')

// const webport = process.env.webport

// URL FORMAT: http://localhost:1884/mqtt?t=/GarageDoor/Command&m=click&retain=true&qos=1
// t=<text> - topic (mandatory)
// m=<text> - payload / message - is mandatory for pub and ignored for sub
// retain=0|1|true|false - whether to retain the message if published
// 
webapp.get('/mqtt', (req, res) => {
  let opts = {}
  if (req.query.qos>0)    { opts.qos = req.query.qos }
  if (req.query.retain) { opts.retain = req.query.retain }

  console.log("webserver received publish request" + req.url)
  client.publish(req.query.t, req.query.m, opts, function(err) {
    if (err) console.log(err)
    res.send('OK')
  })
})


// URL FORMAT: http://localhost:1884/mqttsub?t=/GD/Status&qos=1
// currently only supports reading retained messages once
let submsg = "";

webapp.get('/mqtt_getretained',  (req, res) => {
  // let opts = {}
  // if (req.query.qos>0)    { opts.qos = req.query.qos }
  let topic = req.query.t
  console.log("webserver received subscribe request " + req.url)
  let t = topics[topic]
  if (t) {
    res.send(t)
  } else {
    res.send("<null>")
  }

})

webapp.listen(process.env.webport, () => {
  console.log(`Webserver listening at ${process.env.webport}`)
})

