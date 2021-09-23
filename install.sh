# brew install mosquitto
# sh mosquitto.sh

brew install node
npm install
sudo npm install pm2 -g 
pm2 start mqtt.js --name mqtt-garage --watch
pm2 startup # then run the command that comes after it.
# or node mqtt.js &
pm2 logs