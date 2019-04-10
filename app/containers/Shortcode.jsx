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
      APIErrors: "",
      loadingPage: true
    }

      this.getSettings();

  } 

  getSettings = () => {
      this.fetchWP.get( 'adminTitle' )
      .then((json) => {
        if(json.value){
          console.log(json)
          this.setState({galleryHeader: json.value})
        }else{
          console.log(json)
        }
      }
      )
      .catch((err) => this.setState({APIErrors: err}))
      this.fetchWP.get( 'adminCategory' )
      .then((json) =>{
        if(json.value){
          this.setState({categoryToRender: json.value}),
          console.log(json)
        }else{
          console.log(json)
          this.setState({APIErrors: "Please set a parent category in the settings menu!"})
        }
      }
      )
      .catch((err) => this.setState({ APIErrors: err }))
    }

    componentDidMount(){this.setState({ loadingPage: false })}
    
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
        {this.state.APIErrors === "" ? null : <p id="parentCatError"> <span id="parentCatErrorHighlight">ERROR:</span> {this.state.APIErrors}</p>}
        <AllPosts 
        api_url={this.props.wpObject.api_url}
        api_nonce={this.props.wpObject.api_nonce} 
        categoryToRender={this.state.categoryToRender}
        showSearchBar={this.state.showSearchBar}
        showCategoryError={this.state.showCategoryError}
        />
      </div>
    );
  }


  
}

Shortcode.propTypes = {
  wpObject: PropTypes.object
};