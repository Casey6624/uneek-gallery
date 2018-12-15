import React, { Component } from 'react';
import PropTypes from 'prop-types';

import fetchWP from '../utils/fetchWP';
import Notice from "../components/Notice/Notice";

export default class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      savedTitle: '',
      notice: false
    };

    this.fetchWP = new fetchWP({
      restURL: this.props.wpObject.api_url,
      restNonce: this.props.wpObject.api_nonce,
    });

    this.getSetting();
  }

  getSetting = () => {
    this.fetchWP.get( 'admin' )
    .then(
      (json) => this.setState({
        title: json.value,
        savedTitle: json.value
      }),
      (err) => console.log( 'error', err )
    );
  };

  updateSetting = () => {
    this.fetchWP.post( 'admin', { title: this.state.title } )
    .then(
      (json) => this.processOkResponse(json, 'saved'),
      (err) => console.log('error', err)
    );
  }

  deleteSetting = () => {
    this.fetchWP.delete( 'admin' )
    .then(
      (json) => this.processOkResponse(json, 'deleted'),
      (err) => console.log('error', err)
    );
  }

  processOkResponse = (json, action) => {
    if (json.success) {
      this.setState({
        title: json.value,
        savedTitle: json.value,
      });
    } else {
      this.setState({
        notice: {
          type: 'error',
          message: `Setting was not ${method}.`,
        }
      });
    }
  }

  updateInput = (event) => {
    this.setState({
      title: event.target.value,
    });
  }

  handleSave = (event) => {
    event.preventDefault();
    if (this.state.savedEmail === this.state.email) {
      this.setState({
        notice: {
          type: 'warning',
          message: 'Setting unchanged.',
        }
      })
    } else {
      this.updateSetting();
    }
  }

  handleDelete = (event) => {
    event.preventDefault();
    this.deleteSetting();
  }

  render() {
    return (
      <div className="wrap">
        <form>
          <h1>Uneek Gallery Settings</h1>
          
          <label>
          Gallery Title: 
            <input
              type="text"
              placeholder="E.g - My Posts"
              value={this.state.title}
              onChange={this.updateInput}
            />
          </label>

          <button
            id="save"
            className="button button-primary"
            onClick={this.handleSave}
          >Save</button>

          <button
            id="delete"
            className="button button-primary"
            onClick={this.handleDelete}
          >Delete</button>
        </form>

        <Notice
        notice={this.state.notice}
        onDismissClick={this.clearNotice}
      />
      </div>
    );

    clearNotice = () => {
      this.setState({
        notice: false,
      });
    }
  }
}

Admin.propTypes = {
  wpObject: PropTypes.object
};