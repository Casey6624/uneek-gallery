import React, { Component } from 'react';
import PropTypes from 'prop-types';

import fetchWP from '../utils/fetchWP';

import Notice from "../components/Notice/Notice";
import GithubLogo from "../components/GithubLogo/GithubLogo";

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

    this.getSettingsFromAPI();
  }

  // REFRACTED HANDLERS ----------------------------------------------------------------------------------------

  // take the event from the text boxes and update state with their new value
  updateSettingsInput = event => {
    this.setState({ [event.target.name] : event.target.value })
  }

  // used to validate the current setting is not the same as the new inputted one.
  handleSettingSave = (event) => {
    event.preventDefault();
    let settingsType = event.target.name;
    switch(settingsType){
      case "title":
      if ( this.state.title === this.state.savedTitle ) {
        this.setState({
          notice: {
            type: 'warning',
            message: `Setting Unchanged: the ${settingsType} is already set to the inputted value.`
          }
        });
      } else {
        this.updateTitleSetting(settingsType);
      }
      break;
      case "category":
      if ( this.state.category === this.state.savedCategory ) {
        this.setState({
          notice: {
            type: 'warning',
            message: `Setting Unchanged: the ${settingsType} is already set to the inputted value.`
          }
        });
      } else {
        this.updateCategorySetting(settingsType);
      }
      break;
    }
  }

  handleSettingDelete = event => {
    event.preventDefault();
    let settingType = event.target.name;

    switch(settingType){
      case "title":
      this.deleteTitleSetting(settingType);
      break;
      case "category":
      this.deleteCategorySetting(settingType);
      break;
    }
  }

  clearNotice = () => {
    this.setState({
      notice: false,
    });
  }
  // *************************************************************************************************************
  // REFRACTED API CALLS-------------------------------------------------------------------------------------------

  // Call all PHP endpoints and setState with results
  getSettingsFromAPI = () => {
    let errors = [];
    this.fetchWP.get( 'adminTitle' )
    .then(
      (json) => this.setState({
        title: json.value,
        savedTitle: json.value
      }),
      (err) => errors.push(err)
    );
    this.fetchWP.get( 'adminCategory' )
    .then(
      (json) => this.setState({
        category: json.value,
        savedCategory: json.value
      }),
      (err) => errors.push(err)
    );
  };
  // Validate and display setState errors if any issues
  processOkResponse = (json, action, settingType) => {
    switch(settingType){
      case "title":
      if (json.success) {
        this.setState({title: json.value, savedTitle: json.value, notice: {type: 'success',message: `Setting ${action} successfully.`,}});
      } else {
        this.setState({notice: { type: 'error', message: `Setting was not ${action}.`,}});
      }
      break;
      case "category":
      if (json.success) {
        this.setState({category: json.value, savedCategory: json.value, notice: {type: 'success',message: `Setting ${action} successfully.`,}});
      } else {
        this.setState({notice: { type: 'error', message: `Setting was not ${action}.`,}});
      }
      break;
    }
  }
  // TITLE API CALLS -----------------------------------------------------------------------------------------------

  updateTitleSetting = (settingType) => {
    this.fetchWP.post( 'adminTitle', { title: this.state.title } )
    .then((json) => this.processOkResponse(json, 'saved', settingType),(err) => this.setState({
        notice: {type: 'error', message: err.message}}));
  }

  deleteTitleSetting = (settingType) => {
    this.fetchWP.delete( 'adminTitle' )
    .then((json) => this.processOkResponse(json, 'deleted', settingType),(err) => console.log('error', err));
  }

   // CATEGORY API CALLS -----------------------------------------------------------------------------------------------

  updateCategorySetting = (settingType) => {
    this.fetchWP.post( 'adminCategory', { category: this.state.category } )
    .then((json) => this.processOkResponse(json, 'saved', settingType),(err) => this.setState({
        notice: {type: 'error', message: err.message}}));
  }

  deleteCategorySetting = (settingType) => {
    this.fetchWP.delete( 'adminCategory' )
    .then((json) => this.processOkResponse(json, 'deleted', settingType),(err) => console.log('error', err));
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
          <h1>UNEEK GALLERY SETTINGS</h1>
          <br/>
          <h3>Your Shortcode:&nbsp; <input type="text" value="[uneek-gallery]"/></h3>
          <h4>How Does Uneek Gallery Work?</h4>
          <p>
            Uneek Gallery takes a user inputted category ID, pulls the posts which match the category ID over the REST API and displays them within a list. If you assign child categories to the parent category, then Uneek Gallery will automatically place each category into its own sub list.
          </p>
          <h4>What would you like the title of the gallery to be? (Appears above the search bar.)</h4>
          <label> 
          Gallery Title: &nbsp;
            <input
              type="text"
              name="title"
              value={this.state.title}
              placeholder="E.g My Posts"
              onChange={this.updateSettingsInput}
            />&nbsp;
          </label>
      
          <button
            id="save"
            name="title"
            className="button button-primary"
            onClick={this.handleSettingSave}
          >Save</button>&nbsp;

          <button
            id="delete"
            name="title"
            className="button button-primary"
            onClick={this.handleSettingDelete}
          >Delete</button>
          <br/><br/>
          {/*-------------------------------------------------------------------------------------------------*/}
          <h4>Which category would you like to display on the gallery? <i>NOTE: You can list multiple categories by seperating the IDs with a comma (E.g 1, 4 would return categories 1 and 4 ).</i></h4>
          <label> 
          Parent Category ID: &nbsp;
            <input
              type="number"
              name="category"
              value={this.state.category}
              placeholder="E.g Posts"
              onChange={this.updateSettingsInput}
            />&nbsp;
          </label>

          <button
            id="save"
            name="category"
            className="button button-primary"
            onClick={this.handleSettingSave}
          >Save</button>&nbsp;

          <button
            id="delete"
            name="category"
            className="button button-primary"
            onClick={this.handleSettingDelete}
          >Delete</button><br/><br/>
        </form>
        <hr />
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div style={{
          margin: 10
        }}>
        <h2>Issues with Uneek Gallery or wish to contribute?</h2>
        <h4><a href="https://github.com/Casey6624/uneek-gallery">Click Here To Open A Pull Request Or Fork the Github Project</a></h4>
        </div>
        <a href="https://github.com/Casey6624/uneek-gallery"><GithubLogo /></a>
        </div>
      </div>
    );
  }
}

Admin.propTypes = {
  wpObject: PropTypes.object
};