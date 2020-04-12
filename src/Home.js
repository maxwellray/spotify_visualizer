import React from 'react';
import {connect} from 'react-redux';
import * as spotifyActions from './actions/spotifyActions';
import {bindActionCreators} from "redux";
import Interval from './Interval';
import openSocket from 'socket.io-client';
import {
  BackgroundDiv,
  LoginWithSpotify
} from "./HomeComponents";
import config from './config';
import LoadingComponent from "./LoadingComponent";

const msToTime = (ms) => {
  const minutes = Math.floor(ms / config.TIME_IN_MS.MINUTE);
  const seconds = Math.floor((ms / config.TIME_IN_MS.SECOND) - (minutes * 60));
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
};

const url        = config.SPOTIFY_AUTH_URL;
const components = Object.entries({
  client_id: config.SPOTIFY_CLIENT_ID,
  response_type: 'code',
  redirect_uri: config.SPOTIFY_CALLBACK,
  scope: config.SPOTIFY_SCOPES,
  show_dialog: 'false'
}).reduce((acc, [k, v]) => [...acc, encodeURIComponent(k) + '=' + encodeURIComponent(v)], []).join('&');

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColor: 'white'
    }
  }

  updateColor = (s) => function () {
    if (!this.props.currentlyPlaying) {
      this.setState({
        currentColor: 'white'
      });
      return;
    }
    const currentlyPlaying  = this.props.currentlyPlaying;
    const hueProgressMS     = currentlyPlaying.progress_ms + (Date.now() - currentlyPlaying.progress_set) + config.HUE_TIMING_DELAY_MS;
    const currentHueSection = currentlyPlaying.colors.segmentColors
      .filter(({start, end}) => start <= hueProgressMS && end >= hueProgressMS);

    const currentHueColor = currentHueSection.length > 0 ? currentHueSection[0].hexColor : '#000000';
    s.emit('command', JSON.stringify({
      color: currentHueColor
    }));
  }.bind(this);

  componentDidMount() {
    if (this.props.isLoggedIn) {
      new Interval({
        fn: () => this.props.getCurrentlyPlaying(this.props.token, this.props.currentlyPlaying ? this.props.currentlyPlaying.id : null),
        run_immediate: true,
        t: config.TIME_IN_MS.SECOND
      });

      const socket = openSocket('localhost:3002', {transports: ['websocket']});
      new Interval({
        fn: this.updateColor(socket),
        run_immediate: true,
        t: 1
      });
    }
  }

  renderLoginWithSpotify() {
    return (
      <BackgroundDiv>
        <LoginWithSpotify href={`${url}?${components}`}>login with spotify</LoginWithSpotify>
      </BackgroundDiv>
    )
  }

  renderLoading() {
    return (
      <BackgroundDiv>
        <LoadingComponent/>
      </BackgroundDiv>
    )
  }

  renderLoggedIn() {
    const currentlyPlaying = this.props.currentlyPlaying;
    const albumArt         = currentlyPlaying.album.images[0].url;
    const albumName        = currentlyPlaying.album.name;
    const songName         = currentlyPlaying.name;
    const artistString     = currentlyPlaying.artists.map(({name}) => name).join(', ');
    const progressMS       = currentlyPlaying.progress_ms + (Date.now() - currentlyPlaying.progress_set);
    const durationMS       = currentlyPlaying.duration_ms;
    return (
      <BackgroundDiv>
        <img height='400px' width='400px' src={albumArt} alt="Album Art"/>
        <h1>{songName}</h1>
        <h2>{albumName} - {artistString}</h2>
        <p>{msToTime(progressMS)}/{msToTime(durationMS)}</p>
      </BackgroundDiv>
    )
  }

  render() {
    return this.props.isLoggedIn ? this.props.currentlyPlaying ? this.renderLoggedIn() :
      this.renderLoading() : this.renderLoginWithSpotify()
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: !!state.spotify.token,
    token: state.spotify.token,
    currentlyPlaying: state.spotify.currentlyPlaying,
    hue: state.hue
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(spotifyActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
