import React, { Component } from 'react';
import PropTypes from 'prop-types';

import fetchWP from '../utils/fetchWP';

import Notice from "../components/Notice/Notice";

export default class Admin extends Component {
  constructor(props) {
    super(props);

    // Set the default states
    this.state = {
      title: '',
      savedTitle: '',
      category: '',
      savedCategory: '',
      notice: false,
    };

    this.fetchWP = new fetchWP({
      restURL: this.props.wpObject.api_url,
      restNonce: this.props.wpObject.api_nonce
    });

    // Get the currently set title address from our /admin endpoint and update the title state accordingly
    this.getTitleSetting();
    this.getCategorySetting();
  }
  // Title API Calls -----------------------------------------------------------------------------------------------
  getTitleSetting = () => {
    this.fetchWP.get( 'admin' )
    .then(
      (json) => this.setState({
        title: json.value,
        savedTitle: json.value
      }),
      (err) => console.log( 'error', err )
    );
  };

  updateTitleSetting = () => {
    this.fetchWP.post( 'admin', { title: this.state.title } )
    .then(
      (json) => this.processOkTitleResponse(json, 'saved'),
      (err) => this.setState({
        notice: {
          type: 'error',
          message: err.message, // The error message returned by the REST API
        }
      })
    );
  }

  deleteTitleSetting = () => {
    this.fetchWP.delete( 'admin' )
    .then(
      (json) => this.processOkTitleResponse(json, 'deleted'),
      (err) => console.log('error', err)
    );
  }

  processOkTitleResponse = (json, action) => {
    if (json.success) {
      this.setState({
        title: json.value,
        savedTitle: json.value,
        notice: {
          type: 'success',
          message: `Setting ${action} successfully.`,
        }
      });
    } else {
      this.setState({
        notice: {
          type: 'error',
          message: `Setting was not ${action}.`,
        }
      });
    }
  }

   // Category API Calls -----------------------------------------------------------------------------------------------
   getCategorySetting = () => {
    this.fetchWP.get( 'adminCategory' )
    .then(
      (json) => this.setState({
        category: json.value,
        savedCategory: json.value
      }),
      (err) => console.log( 'error', err )
    );
  };

  updateCategorySetting = () => {
    this.fetchWP.post( 'adminCategory', { category: this.state.category } )
    .then(
      (json) => this.processOkCategoryResponse(json, 'saved'),
      (err) => this.setState({
        notice: {
          type: 'error',
          message: err.message, // The error message returned by the REST API
        }
      })
    );
  }

  deleteCategorySetting = () => {
    this.fetchWP.delete( 'adminCategory' )
    .then(
      (json) => this.processOkCategoryResponse(json, 'deleted'),
      (err) => console.log('error', err)
    );
  }

  processOkCategoryResponse = (json, action) => {
    if (json.success) {
      this.setState({
        category: json.value,
        savedCategory: json.value,
        notice: {
          type: 'success',
          message: `Setting ${action} successfully.`,
        }
      });
    } else {
      this.setState({
        notice: {
          type: 'error',
          message: `Setting was not ${action}.`,
        }
      });
    }
  }

  // Title Handlers -----------------------------------------------------------------------------------
  updateTitleInput = (event) => {
    this.setState({
      title: event.target.value,
    });
  }

  handleTitleSave = (event) => {
    event.preventDefault();
    if ( this.state.title === this.state.savedTitle ) {
      this.setState({
        notice: {
          type: 'warning',
          message: 'Setting Unchanged: the title is already set to the inputted value.,'
        }
      });
    } else {
      this.updateTitleSetting();
    }
  }

  handleTitleDelete = (event) => {
    event.preventDefault();
    this.deleteTitleSetting();
  }

  // Category Handlers -------------------------------------------------------------------------------------------

  updateCategoryInput = (event) => {
    this.setState({
      category: event.target.value,
    });
  }

  handleCategorySave = (event) => {
    event.preventDefault();
    if ( this.state.category === this.state.savedCategory ) {
      this.setState({
        notice: {
          type: 'warning',
          message: 'Setting Unchanged: the category is already set to the inputted value.',
        }
      });
    } else {
      this.updateCategorySetting();
    }
  }

  handleCategoryDelete = (event) => {
    event.preventDefault();
    this.deleteCategorySetting();
  }
  //------------------------------------------------------------------------------------------------------------------
  clearNotice = () => {
    this.setState({
      notice: false,
    });
  }

  render() {
    let notice;
    
    if ( this.state.notice ) {
      notice = <Notice notice={this.state.notice} onDismissClick={this.clearNotice} />
    }

    return (
      <div className="wrap">
        {notice}
        <form>
          <h1>Uneek Gallery Settings</h1>
          <br/>
          <p>What would you like the title of the gallery to be?</p>
          <label> 
          Gallery Title: &nbsp;
            <input
              type="title"
              value={this.state.title}
              placeholder="E.g My Posts"
              onChange={this.updateTitleInput}
            />&nbsp;
          </label>

          <button
            id="save"
            className="button button-primary"
            onClick={this.handleTitleSave}
          >Save</button>&nbsp;

          <button
            id="delete"
            className="button button-primary"
            onClick={this.handleTitleDelete}
          >Delete</button>
          <br/><br/>
          {/*-------------------------------------------------------------------------------------------------*/}
          <p>Which category would you like to display on the gallery? You can list multiple categories by seperating the IDs with a comma (E.g "1, 4" would return categories 1 and 4 ).</p>
          <label> 
          Category ID: &nbsp;
            <input
              type="category"
              value={this.state.category}
              placeholder="E.g Posts"
              onChange={this.updateCategoryInput}
            />&nbsp;
          </label>

          <button
            id="save"
            className="button button-primary"
            onClick={this.handleCategorySave}
          >Save</button>&nbsp;

          <button
            id="delete"
            className="button button-primary"
            onClick={this.handleCategoryDelete}
          >Delete</button>
        </form>
      </div>
    );
  }
}

Admin.propTypes = {
  wpObject: PropTypes.object
};