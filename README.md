# mqtt+webproxy

# INSTALL
- get a working .env
- brew install node
- npm install
- sudo npm install pm2 -g 
- pm2 start mqtt.js --name mqtt --watch
- pm2 startup # then run the command that comes after it.
- pm2 logs
- install duckdns


# TODO

## TODO - Nice to have.
- QOS 2 not working... web request is finishing and killing the thread before CONNACK is received. qos1 is fine for our needs
- no error handling on publish fail
- poor error handling on connect fail. e.g. timeouts just loop
- add https certificate. has ongoing maintenance attached.
