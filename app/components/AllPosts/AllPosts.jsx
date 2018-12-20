// Libaries
import React, { Component } from "react";
import axios from "axios";
//import _ from "lodash";
// Components
import Loading from "../../../assets/Loading/Loading";
import Post from "../Post/Post";
import SearchBar from "../SearchBar/SearchBar";

export default class AllPosts extends Component{

    state = {
        postData: [],
        dataFetched: false,
        filterValue: ""
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

    stripHTML = (indexOrData) => {
        let rawData;

        if(Number.isInteger(indexOrData)){
            rawData = this.state.postData[indexOrData].excerpt.rendered;
        }else{
            rawData = indexOrData;
        }
        return new DOMParser()
          .parseFromString(rawData, 'text/html')
          .body
          .textContent
          .trim()
      }


      filterChangeHandler = e => this.setState({ filterValue: e.target.value});

      filterItems(){
        const { postData, filterValue } = this.state;
        const sortedFilteredPosts = postData.filter(({ title }) => title.rendered.includes(filterValue));
        return sortedFilteredPosts;
      }

render(){

    console.log(this.props.showSearchBar);

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
            <div className="noPostsFound">
                <h1 >No Posts Found! :(</h1>
                <p>Please visit <strong>Settings/Uneek Gallery</strong> from the dashboard and check the category selected.</p>
            </div>
        )
    }

    if(this.state.filterValue !== ""){
        return(
            <div>
                <div className="uneekGallerySearchBarContainer">
                    <SearchBar value={this.state.filterValue} onChange={this.filterChangeHandler}/>
                </div>
            {this.filterItems().map((post, index) => <Post
                key={this.filterItems()[index].id}
                filmTitle={this.filterItems()[index].title.rendered}
                filmExcerpt={this.stripHTML(this.filterItems()[index].excerpt.rendered)}  
                filmImage={this.filterItems()[index].better_featured_image.source_url}
                filmLink={this.filterItems()[index].link}
            />)}
                
            </div>
        )
    }

    return(
        <div>
        {this.props.showSearchBar ? <div className="uneekGallerySearchBarContainer"><SearchBar value={this.state.filterValue} onChange={this.filterChangeHandler}/></div> : null}
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