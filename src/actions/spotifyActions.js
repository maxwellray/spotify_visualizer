// import redux from 'redux';
// import reduxThunk from 'redux-thunk';
import {
  SET_USER_PROFILE, SET_TOKEN, SET_CURRENTLY_PLAYING
} from '../actionTypes'
import axios from 'axios';
import qs from 'qs';
import * as util from '../utilities';
import config from '../config';

export const setAuth = (code) => (dispatch) => {
  axios.post(config.SPOTIFY_TOKEN_URL, qs.stringify({
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.SPOTIFY_CALLBACK,
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    }
  }).then((res) => {
    dispatch({
      type: SET_TOKEN,
      payload: {
        token: res.data.access_token,
        expiresIn: res.data.expires_in,
        refreshToken: res.data.refresh_token,
        scope: res.data.scope
      }
    });
  }).catch(e => {
    console.error(e);
    dispatch({
      type: 'NULL'
    })
  });
};

export const setUserProfile = (token) => (dispatch) => {
  axios.get(`${config.SPOTIFY_API_URL}/${config.SPOTIFY_API_PATHS.PROFILE}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => {
    console.log(res);
    dispatch({
      type: SET_USER_PROFILE,
      payload: 'success'
    })
  }).catch(e => {
    console.error(e);
  })
};

export const getCurrentlyPlaying = (token, prevSongId=null) => async (dispatch) => {
  const songInfo = await axios.get(`${config.SPOTIFY_API_URL}/${config.SPOTIFY_API_PATHS.CURRENTLY_PLAYING}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const currently_playing = {
    ...songInfo.data.item,
    progress_ms: songInfo.data.progress_ms,
    progress_set: Date.now()
  };
  if (currently_playing.id !== prevSongId) {
    const trackAnalysis = await axios.get(`${config.SPOTIFY_API_URL}/${config.SPOTIFY_API_PATHS.TRACK_ANALYSIS}/${currently_playing.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const colors = {
      tatumColors: util.generateColorMap(trackAnalysis.data.tatums),
      beatColors: util.generateColorMap(trackAnalysis.data.beats),
      barColors: util.generateColorMap(trackAnalysis.data.bars),
      sectionColors: util.generateColorMap(trackAnalysis.data.sections),
      segmentColors: util.generateColorMap(trackAnalysis.data.segments)
    };
    dispatch({
      type: SET_CURRENTLY_PLAYING,
      payload: {...currently_playing, trackAnalysis: trackAnalysis.data, colors}
    })
  } else {
    dispatch({
      type: SET_CURRENTLY_PLAYING,
      payload: currently_playing
    })
  }
};
