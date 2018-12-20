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
      search: '',
      savedSearch: '',
      notice: false,
    };

    this.fetchWP = new fetchWP({
      restURL: this.props.wpObject.api_url,
      restNonce: this.props.wpObject.api_nonce
    });

    // Get the currently set title address from our /admin endpoint and update the title state accordingly
    this.getTitleSetting();
    this.getCategorySetting();
    this.getSearchSetting();
  }
  // Title API Calls -----------------------------------------------------------------------------------------------
  getTitleSetting = () => {
    this.fetchWP.get( 'adminTitle' )
    .then(
      (json) => this.setState({
        title: json.value,
        savedTitle: json.value
      }),
      (err) => console.log( 'error', err )
    );
  };

  updateTitleSetting = () => {
    this.fetchWP.post( 'adminTitle', { title: this.state.title } )
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
    this.fetchWP.delete( 'adminTitle' )
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

  // Search API Calls -----------------------------------------------------------------------------------------------
  getSearchSetting = () => {
    this.fetchWP.get( 'adminSearch' )
    .then(
      (json) => this.setState({
        search: json.value,
        savedSearch: json.value
      }),
      (err) => console.log( 'error', err )
    );
  };

  updateSearchSetting = () => {
    this.fetchWP.post( 'adminSearch', { search: this.state.search } )
    .then(
      (json) => this.processOkSearchResponse(json, 'saved'),
      (err) => this.setState({
        notice: {
          type: 'error',
          message: err.message, // The error message returned by the REST API
        }
      })
    );
  }

  deleteSearchSetting = () => {
    this.fetchWP.delete( 'adminSearch' )
    .then(
      (json) => this.processOkSearchResponse(json, 'deleted'),
      (err) => console.log('error', err)
    );
  }

  processOkSearchResponse = (json, action) => {
    if (json.success) {
      this.setState({
        search: json.value,
        savedSearch: json.value,
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

    // Search Handlers -----------------------------------------------------------------------------------
    updateSearchInput = (event) => {
      this.setState({
        search : event.target.value,
      });
    }
  
    handleSearchSave = (event) => {
      event.preventDefault();
      if ( this.state.search === this.state.savedSearch ) {
        this.setState({
          notice: {
            type: 'warning',
            message: 'Setting Unchanged: Requested search setting is already enabled.,'
          }
        });
      } else {
        this.updateSearchSetting();
      }
    }
  
    handleSearchDelete = (event) => {
      event.preventDefault();
      this.deleteSearchSetting();
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
          <h4>What would you like the title of the gallery to be?</h4>
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
          <h4>Which category would you like to display on the gallery? <i>NOTE: You can list multiple categories by seperating the IDs with a comma (E.g "1, 4" would return categories 1 and 4 ).</i></h4>
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
          >Delete</button><br/><br/>
          {/*-------------------------------------------------------------------------------------------------*/}
          <h4>Would you like to enable a search bar so visitors can refine the list of posts?</h4>
          <label> 
          Show Search Bar?&nbsp;
          <select type="search" onChange={this.updateSearchInput} value={this.state.search}>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>&nbsp;
          </label>

          <button
            id="save"
            className="button button-primary"
            onClick={this.handleSearchSave}
          >Save</button>&nbsp;

          <button
            id="delete"
            className="button button-primary"
            onClick={this.handleSearchDelete}
          >Delete</button>

        </form>
      </div>
    );
  }
}

Admin.propTypes = {
  wpObject: PropTypes.object
};