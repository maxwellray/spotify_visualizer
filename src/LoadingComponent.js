import React, {Component} from 'react';
import {ReactSVG} from 'react-svg';

export default class LoadingComponent extends Component {
  render() {
    return (
      <ReactSVG
        src={"loading.svg"}
        afterInjection={(error) => {
          if (error) {
            console.error(error)
          }
        }}
        beforeInjection={svg => {
          svg.classList.add('svg-class-name')
          svg.setAttribute('style', 'width: 200px')
        }}
        evalScripts="always"
        fallback={() => <span>Loading</span>}
        renumerateIRIElements={false}
        wrapper="span"
        className="wrapper-class-name"
      />
    )
  }
}
