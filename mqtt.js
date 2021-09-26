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

let topics = {};
client.on('message', function (topic, message) {
  // message is Buffer
  let m = message.toString();
  topics[topic] = m;
  // client.end()
  console.log("Message received: ", topics)
})

// well this is garage door specifically... damn
client.subscribe('/GD/Status', {qos:1}, function(err) {
  if (err) console.log(err)
})
client.subscribe('/GD/DoorStatus', {qos:1}, function(err) {
  if (err) console.log(err)
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


///////////////////////////////////////////////
// SETUP THE AEDES MQTT SERVER

var aedesPersistenceRedis = require('aedes-persistence-redis')

const aedes = require('aedes')( 
  {
    persistence: aedesPersistenceRedis({
      port: 6379,          // Redis port
      host: '127.0.0.1'} )
  }
  // persistence: mongoPersistence({
  //   url: 'mongodb://127.0.0.1/aedes-test',
  //   // Optional ttl settings
  //   ttl: {
  //       packets: 300, // Number of seconds
  //       subscriptions: 300
  //   }
  // }
)

const mqttserver = require('net').createServer(aedes.handle)
// const port = 1883

mqttserver.listen(process.env.mqttport, function () {
  console.log('MQTT server listening on port ' + process.env.mqttport)
})

aedes.on('client', function (client) {
  console.log(client.id + " connected")
})

aedes.on('clientError', function (client, err) {
  console.log(client.id + ' client error: ' +  err.message)
})

aedes.on('connectionError', function (client, err) {
  console.log(client.id + ' client error: ' + err.message)
})

aedes.on('publish', function (packet, client) {
  if (client) {
    pkt = {topic: packet.topic, payload: packet.payload.toString()}
    if (packet.qos) { pkt.qos = packet.qos}
    if (packet.retain) { pkt.retain = packet.retain}
    // console.log(client)
    console.log(client.id + ' published ' + JSON.stringify(pkt))
  } 
})

aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log(client.id + ' subscribed ' + JSON.stringify(subscriptions))
  }
})


aedes.authenticate = function (client, username, password, callback) {
  if( username == process.env.mqttuser && 
      password == process.env.mqttpass) {
    callback(null, true)
  } else {
    callback(null, false)
    // console.log("Client Creds Successfully")
  }
}