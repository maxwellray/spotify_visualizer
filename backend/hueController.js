const _ = require('lodash');
const Promise = require('bluebird');
const dtls    = require('node-dtls-client').dtls;
const http    = require('http');
const config  = require('./config');

const buildMessage = ({color, brightness=1.0}) => {
  const [,rHex, gHex, bHex] = color.toUpperCase().match(/#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/);
  const rVal = parseInt(`0x${rHex}`);
  const gVal = parseInt(`0x${gHex}`);
  const bVal = parseInt(`0x${bHex}`);

  const rSquared = Math.pow(rVal, 2);
  const gSquared = Math.pow(gVal, 2);
  const bSquared = Math.pow(bVal, 2);

  const rString = _.chunk(rSquared.toString(16).padStart(4,'0'), 2).map((v) => parseInt(`0x${v.join('')}`));
  const gString = _.chunk(gSquared.toString(16).padStart(4,'0'), 2).map((v) => parseInt(`0x${v.join('')}`)); // lol
  const bString = _.chunk(bSquared.toString(16).padStart(4,'0'), 2).map((v) => parseInt(`0x${v.join('')}`));

  const colorBuffer = Buffer.from(_.flatten([rString, gString, bString]));

  return Buffer.concat([
    Buffer.from('HueStream', 'ascii'),
    Buffer.from([
      0x01, 0x00,
      0x00,
      0x00, 0x00,
      0x00,
      0x00,
      0x00,
      0x00, 0x03,
      // 0x00, 0x00, 0x00, 0x00, 0xff, 0xff
    ]),
    colorBuffer
  ])
};

const getSocket = async () => {
  await new Promise((resolve, reject) => {
    const req = http.request(config.HUE_SET_STREAM_URL, {
      method: 'PUT'
    }, (res) => {
      if (res.statusCode === 200) {
        resolve();
      }
      reject(res.statusMessage);
    });
    req.write(JSON.stringify({stream: {active: true}}));
    req.end();
  });
  return new Promise((resolve, reject) => {
    const s = dtls.createSocket({
      type: 'udp4',
      address: config.HUE_HOST_ADDRESS,
      port: config.HUE_HOST_PORT,
      psk: {
        [config.HUE_USERNAME]: Buffer.from(config.HUE_SECRET, 'hex')
      }
    }).on('connected', () => {
      resolve(s);
      console.log('connected');
    }).on('message', (msg) => {
      console.log(msg);
    }).on('error', (e) => {
      console.error(e);
      reject(s);
    }).on('close', () => {
      console.log('closed');
    });
  });
};

module.exports = {
  getSocket,
  buildMessage
};
