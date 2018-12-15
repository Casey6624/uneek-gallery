import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Widget extends Component {
  render() {
    return (
      <div>
        <h1>Uneek Gallery</h1>
        <p>Title: {this.props.wpObject.title}</p>
      </div>
    );
  }
}

Widget.propTypes = {
  wpObject: PropTypes.object
};