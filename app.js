'use strict';
const telegram = require('./js/telegram');
const udp = require('./js/udp');
udp.set();
telegram.service(udp);

console.log('Cartik Telegram push message bot');