import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AllPosts from "../components/AllPosts/AllPosts";
//import SearchBar from "../components/SearchBar/SearchBar";
import fetchWP from "../utils/fetchWP";

export default class Shortcode extends Component {

  constructor(props){
    super(props);

    this.fetchWP = new fetchWP({
      restURL: this.props.wpObject.api_url,
      restNonce: this.props.wpObject.api_nonce,
    });

    this.state = {
      galleryHeader: null
    }

    // Get the currently set title address from our /admin endpoint and update the title state accordingly
    this.getSetting();
  } 

  getSetting = () => {
    this.fetchWP.get( 'admin' )
    .then(
      (json) => this.setState({galleryHeader: json.value}),
      (err) => console.log( 'error', err )
    );
   console.log(this.props.wpObject) 
  };

  render() {
    return (
      <div>
        <h1 className="filmListHeader" >{this.state.galleryHeader}</h1>
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