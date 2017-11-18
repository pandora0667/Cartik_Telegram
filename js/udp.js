'use strict';

const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const port = 5001;
let info = null;

exports.set = () => {
    server.bind(port);

    server.on('error', (err) => {
        console.log('UDP server Error : ', err.stack);
        server.close();
    });

    server.on('listening', () => {
        const address = server.address();
        console.log(`server listening ${address.address}:${address.port}`);
    });

    server.on('message', (data) => {
        let re = /\0/g;
        let str = data.toString().replace(re, '');
        info = JSON.parse(str);
    })
};

exports.receive = async () => {
    return new Promise(resolve => {
        resolve(info);
    });
};
