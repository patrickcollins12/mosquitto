const msgpack = require('msgpack-lite')
const Redis = require("ioredis");
const redis = new Redis(); // uses defaults unless given configuration object


let t = "/GD/Status"
redis.hgetBuffer("retained", t, (err, result) => {
    if (err) { console.log(err); return; }
    if (!result) { console.log(t + " doesn't exist"); return }

    u= msgpack.decode(result)
    console.log(u.topic + '-->' +u.payload.toString() )         
    
    process.exit()
  });

