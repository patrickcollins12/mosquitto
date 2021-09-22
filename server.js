const express = require('express')
var mqtt = require('mqtt')

const webapp = express()
const webport = 1884

var client  = mqtt.connect('mqtt://garagedoorpc.zapto.org:1883')

webapp.get('/', (req, res) => {
  res.send('Hello World!')
  client.publish('/GarageDoor/Action', 'click')
})

webapp.listen(webport, () => {
  console.log(`Example app listening at http://localhost:${webport}`)
})


// client.on('connect', function () {
//   client.subscribe('presence', function (err) {
//     if (!err) {
//       client.publish('presence', 'Hello mqtt')
//     }
//   })
// })

// client.on('message', function (topic, message) {
//   // message is Buffer
//   console.log(message.toString())
//   client.end()
// })