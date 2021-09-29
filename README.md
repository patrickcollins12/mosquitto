# mqtt+webproxy

# INSTALL
- get a working .env
- brew install node
- npm install
- sudo npm install pm2 -g 
- pm2 start mqtt.js --name mqtt --watch
- pm2 startup # then run the command that comes after it.
- pm2 logs


# TODO
- remove these two specific references for watching /GD/DoorStatus
- /GD/Status is wrong. push the code.
- The Log for Closed/Open in arduino is wrong
- the 3 hour timeout - decide where to put it
- replace the esp32? or fix it?


## TODO - Nice to have.
- QOS 2 not working... web request is finishing and killing the thread before CONNACK is received. qos1 is fine for our needs
- no error handling on publish fail
- poor error handling on connect fail. e.g. timeouts just loop
- add https certificate. has ongoing maintenance attached.
