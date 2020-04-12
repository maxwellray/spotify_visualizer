const config = {};

config.HUE_HOST_ADDRESS = process.env.HUE_HOST;
config.HUE_HOST_PORT = parseInt(process.env.HUE_PORT);

config.HUE_USERNAME = process.env.HUE_USERNAME;
config.HUE_SECRET = process.env.HUE_SECRET;

config.HUE_LIGHT = 1;
config.HUE_SET_STREAM_URL = `http://${config.HUE_HOST_ADDRESS}/api/${config.HUE_USERNAME}/groups/${config.HUE_LIGHT}`;

module.exports = config;
