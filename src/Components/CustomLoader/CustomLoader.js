import React, { Component } from 'react'
import Loader from 'react-loader-spinner';

export default class CustomLoader extends Component {
  render() {
    return (
      <div className="custom-loader-container">
        <Loader
          type="ThreeDots"
          color="#00BFFF"
          height="100"	
          width="100"
        />
      </div>
    )
  }
}
