/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AllPosts from "../components/AllPosts/AllPosts";
import fetchWP from "../utils/fetchWP";
import Loading from "../components/Loading/Loading";



export default function Shortcode(props){

  fetchWP = new fetchWP({
    restURL: props.wpObject.api_url,
    restNonce: props.wpObject.api_nonce,
  });


  const [galleryHeader, setGalleryHeader] = useState(null)
  const [categoryToRender, setCategoryToRender] = useState(null)
  const [showSearchBar, setShowSearchBar] = useState(null)
  const [APIErrors, setAPIErrors] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  function getSettings(){
      fetchWP.get( 'adminTitle' )
      .then((json) => {
        if(json.value){
          setGalleryHeader(json.value)
        }else{
          console.log(json)
        }
      }
      )
      .catch((err) => setAPIErrors(err))

      fetchWP.get( 'adminCategory' )
      .then((json) =>{
        if(json.value){
          setCategoryToRender(json.value)
          setIsLoading(false)
        }else{
          console.log(json)
          setAPIErrors("Please set a parent category in the settings menu!")
        }
      }
      )
      .catch((err) => setAPIErrors(err))
    }
    

    if(isLoading){
      return(
        <div>
          <Loading />
        </div>
      )
    }

    return (
      <div className="uneek-container">
        <h1 className="filmListHeader" >{galleryHeader}</h1>
        {APIErrors === "" ? null : <p id="parentCatError"> <span id="parentCatErrorHighlight">ERROR:</span> {APIErrors}</p>}
        <AllPosts 
        api_url={props.wpObject.api_url}
        api_nonce={props.wpObject.api_nonce} 
        categoryToRender={categoryToRender}
        showSearchBar={showSearchBar}
        showCategoryError={showCategoryError}
        />
      </div>
    );
  }
