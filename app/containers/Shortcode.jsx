import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AllPosts from "../components/AllPosts/AllPosts";
import SearchBar from "../components/SearchBar/SearchBar";

export default class Shortcode extends Component {

  /* constructor(props){
    super(props);

    this.fetchWP = new fetchWP({
      restURL: this.props.wpObject.api_url,
      restNonce: this.props.wpObject.api_nonce,
    });

    getSetting = () => {
      this.fetchWP.get("posts")
      .then(json => console.log(json))
    }

    getSetting();
  } */

  render() {
    return (
      <div>
        <h1 className="filmListHeader" >UNEEK FILM PRODUCTIONS</h1>
        <SearchBar 
        className=""
        />
        <AllPosts 
        api_url={this.props.wpObject.api_url}
        />
      </div>
    );
  }


  
}

Shortcode.propTypes = {
  wpObject: PropTypes.object
};