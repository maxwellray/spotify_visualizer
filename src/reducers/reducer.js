import * as _ from 'lodash';
import {
  SET_TOKEN,
  SET_CURRENTLY_PLAYING,
  SET_USER_PROFILE, SET_AUTH_CODE,
  GET_HUE_SOCKET
} from "../actionTypes";

export const initialState = {
  spotify: {
    currentlyPlaying: null,
    token: null,
    refreshToken: null,
    expiresIn: null
  },
  hue: {
    s: null
  }
};

function reduce(state = initialState, {type, payload}) {
  switch (type) {
    case SET_CURRENTLY_PLAYING:
      return {
        ...state,
        spotify: {
          ...state.spotify,
          currentlyPlaying: {
            ...state.spotify.currentlyPlaying,
            ...payload,
            colors: _.get(state, 'spotify.currentlyPlaying.id', null) === payload.id ? state.spotify.currentlyPlaying.colors : payload.colors
          }
        }
      };
    case SET_USER_PROFILE:
    case SET_AUTH_CODE:
    case SET_TOKEN:
      return {
        ...state,
        spotify: {
          ...state.spotify,
          ...payload
        }
      };
    case GET_HUE_SOCKET:
      return {
        ...state,
        hue: {
          ...payload
        }
      };
    default:
      return state;
  }
}

export default reduce;
