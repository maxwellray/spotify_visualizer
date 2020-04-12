import React from 'react';
import {connect} from 'react-redux';
import * as spotifyActions from "./actions/spotifyActions";
import {bindActionCreators} from "redux";
import {Redirect} from 'react-router-dom';
import styled from 'styled-components';
import LoadingComponent from "./LoadingComponent";

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;


class Callback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    }
  }

  componentDidMount() {
    const params = window.location.href.split('?')[1].split('&').reduce((acc, item) => {
      const [k,v] = item.split('=');
      return {
        ...acc,
        [k]:v
      }
    }, {});
    this.props.setAuth(params.code);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.token !== prevProps.token) {
      this.setState({
        loaded: true
      })
    }
  }

  renderRedirect() {
    return <Redirect to='/'/>
  }

  render() {
    return this.state.loaded ? this.renderRedirect() : (
      <LoadingContainer>
        <LoadingComponent/>
      </LoadingContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.spotify.token,
  }
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(spotifyActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Callback);
