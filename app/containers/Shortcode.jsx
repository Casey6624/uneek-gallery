import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AllPosts from "../components/AllPosts/AllPosts";
import fetchWP from "../utils/fetchWP";
import Loading from "../components/Loading/Loading";


export default class Shortcode extends Component {

  constructor(props){
    super(props);

    this.fetchWP = new fetchWP({
      restURL: this.props.wpObject.api_url,
      restNonce: this.props.wpObject.api_nonce,
    });

    this.state = {
      galleryHeader: null,
      categoryToRender: null,
      showSearchBar: null,
      APIErrors: [],
      loadingPage: true
    }

      this.getSettings();

  } 

  getSettings = () => {
      this.fetchWP.get( 'adminTitle' )
      .then(
        (json) => this.setState({galleryHeader: json.value}),
        (err) => this.setState({errors: err})
        );
      this.fetchWP.get( 'adminCategory' )
      .then(
        (json) => this.setState({categoryToRender: json.value}),
        (err) => this.setState({errors: err})
      );
      this.fetchWP.get( 'adminSearch' )
      .then(
        (json) => this.setState({showSearchBar: json.value}),
        (err) => this.setState({errors: err})
      );
    }

    componentDidMount(){
      this.setState({loadingPage: false})
    }
  render() {

    if(this.state.loadingPage){
      return(
        <div>
          <Loading />
        </div>
      )
    }


    return (
      <div className="uneek-container">
        <h1 className="filmListHeader" >{this.state.galleryHeader}</h1>
        <AllPosts 
        api_url={this.props.wpObject.api_url}
        api_nonce={this.props.wpObject.api_nonce}
        categoryToRender={this.state.categoryToRender}
        showSearchBar={this.state.showSearchBar}
        />
      </div>
    );
  }


  
}

Shortcode.propTypes = {
  wpObject: PropTypes.object
};