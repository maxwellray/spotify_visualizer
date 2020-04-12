const config = {};

config.HUE_TIMING_DELAY_MS = 100;

config.SPOTIFY_AUTH_URL =  'https://accounts.spotify.com/authorize';
config.SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'; // Used by the callback to retrieve the access token
config.SPOTIFY_CALLBACK = 'http://localhost:3000/callback';
config.SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
config.SPOTIFY_CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
config.SPOTIFY_SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state'
].join(' ');

config.SPOTIFY_API_URL = 'https://api.spotify.com/v1';
config.SPOTIFY_API_PATHS = {
  PROFILE: 'me',
  CURRENTLY_PLAYING: 'me/player',
  TRACK_ANALYSIS: 'audio-analysis'
}

config.COLORS = [
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#FF69B4',
  '#fdff00'
];

config.TIME_IN_MS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000
};

config.SPOTIFY_ANALYSIS_THRESHOLDS = {
  MIN_CONFIDENCE: 0.3,
  MIN_LOUDNESS: -13
}

export default config;
