# mqtt+webproxy

# TODO
- remove the passwords from public
- get it daemon ready. must have. DONE
- eliminate mosquitto references. DONE

## TODO - Nice to have.
- QOS 2 not working... web request is finishing and killing the thread before CONNACK is received. qos1 is fine for our needs
- no error handling on publish fail
- poor error handling on connect fail. e.g. timeouts just loop
- user/pass on web. 
- add https certificate. has ongoing maintenance attached.

# INSTALL
brew install node
npm install
sudo npm install pm2 -g 
pm2 start mqtt.js --name mqtt-garage --watch
pm2 startup # then run the command that comes after it.
or node mqtt.js &
pm2 logs