'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = '339820205:AAFt_8gTEUD1aNa_I5Q8g7b9sKLfzt4Bsg0';
const bot = new TelegramBot(token, {polling: true});

let clients = new Array();

exports.service = (udp) => {
    push(udp);
    bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, "등록이 완료되었습니다.");
        clients.push(msg.chat.id);
        console.log('등록된 사용자 : ', clients.length);
    });
    bot.onText(/\/stop/, (msg) => {
        bot.sendMessage(msg.chat.id, "삭제 되었습니다.");
        clients.splice(msg.chat.id);
        console.log('등록된 사용자 : ', clients.length);
    });

    bot.on('message', async (msg) => {
        let location = await udp.receive();

        if (msg.text.indexOf('위치') === 0) {
            console.log('위치정보');
            bot.sendLocation(msg.chat.id,location.lat, location.lon);
            bot.sendMessage(msg.chat.id, '현재 위치를 확인하세요');
        }
    });

    bot.on('message', async (msg) => {
        let status = await udp.receive();

        if (msg.text.indexOf('온도') === 0) {
            console.log('온습도 정보');
            let message = '현재 차량 내부 온도는 ' + status.temp + '도 습도는 ' + status.humi + '% 입니다.';
            bot.sendMessage(msg.chat.id, message);
        }
    });

    bot.on('message', async (msg) => {
        let status = await udp.receive();

        if (msg.text.indexOf('속도') === 0) {
            console.log('속도정보');
            let message = '현재 차량 내부 속도는 ' + status.speed + ' Km/h 입니다.';
            bot.sendMessage(msg.chat.id, message);
        }
    });
};

function push(udp) {
    setInterval( async () => {
      let pushInfo = await udp.receive();
      if (pushInfo.mode === 'true') {
          send("다치지 않으셨나요? 심한 충격이 감지되었어요.");
      } else if (parseInt(pushInfo.impulse) > 300) {
          send("운전은 조심조심 안전운전 하세요!!")
      } else if (parseInt(pushInfo.front) === 0 || parseInt(pushInfo.rear) === 0 || parseInt(pushInfo.left) === 0 || parseInt(pushInfo.right) === 0) {
          send("차량 주변에 물제가 감지되었습니다. 확인해 주세요^^")
      }
    }, 1000);
}

function send(msg) {
    clients.forEach((client) => {
        bot.sendMessage(client, msg);
    });
}