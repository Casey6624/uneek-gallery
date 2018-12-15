// Libaries
import React, { Component } from "react";
import axios from "axios";
import _ from "lodash";
// Components
import Loading from "../../../assets/Loading/Loading";
import Post from "../Post/Post";

export default class AllPosts extends Component{

    state = {
        postData: [],
        dataFetched: false
    } 
    getPosts = () => {
        let api_url = this.props.api_url;
        let categoryID = this.props.categoryToRender;
        let trimmedURL = api_url.split("wp-json")[0];
        let fetchParams = `wp-json/wp/v2/posts?categories=${categoryID}`;
        let fetchURL = `${trimmedURL}${fetchParams}`;
        axios.get(fetchURL)
        .then(res => {
            this.setState({
                postData: res.data,
                dataFetched: true
            })
        })
    }    
  

    stripHTML = (index) => {
        let rawData = this.state.postData[index].excerpt.rendered;
        return new DOMParser()
          .parseFromString(rawData, 'text/html')
          .body
          .textContent
          .trim()
      }

render(){

    if(!this.state.dataFetched && this.props.categoryToRender !== null){
        this.getPosts();
        return(
            <div>
                <Loading />
            </div>
        )
    }

    if(this.state.dataFetched && this.state.postData.length === 0){
        return(
            <div>
                <h1 className="noPostsFound">No Posts Found! :(</h1>
                <p className="noPostsFound">Please visit <strong>Settings/Uneek Gallery</strong> from the dashboard and check the category selected.</p>
            </div>
        )
    }

    return(
        <div>
        {this.state.postData.map((post, index) => <Post
        key={this.state.postData[index].id}
        filmTitle={this.state.postData[index].title.rendered}
        filmExcerpt={this.stripHTML(index)}    
        filmImage={this.state.postData[index].better_featured_image.source_url}
        filmLink={this.state.postData[index].link}

        />)}
            
        </div>
    )
}

}