cat ~/.pm2/logs/mqtt-garage-out.log |grep 'esp32.*online'|grep -v 'config'| perl add_date.pl|tail -10

