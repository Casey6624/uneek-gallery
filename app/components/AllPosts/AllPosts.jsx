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
        let categoryID = '4';
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
    if(!this.state.dataFetched){
        this.getPosts();

        return(
            <div>
                <Loading />
            </div>
        )
    }

    if(this.state.dataFetched && this.state.postData.length == 0){
        return(
            <div>No Films Found!</div>
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

/*  <div className="ds-grid">
        <h1 className="ds-grid-item ds-grid-item1">{this.state.postData[0].title.rendered}</h1>
        <p className="ds-grid-item ds-grid-item2">{this.stripHTMLExcerpt()}</p>
        <img className="ds-grid-item ds-grid-item3" src={this.state.postData[0].better_featured_image.source_url} alt={this.state.postData[0].better_featured_image.alt_text}/>
        <br/>
        <a href={this.state.postData[0].link}> <Button bsSize="large" bsStyle="default">VIEW FILM</Button> </a>
    </div> */


}