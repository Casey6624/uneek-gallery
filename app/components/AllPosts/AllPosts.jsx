// Libaries
import React, { Component } from "react";
import axios from "axios";
// Components
import Loading from "../Loading/Loading";
import Post from "../Post/Post";
import SearchBar from "../SearchBar/SearchBar";

export default class AllPosts extends Component{

    state = {
        postData: [],
        dataFetched: false,
        filterValue: "",
        categoryData: null
    } 

    // call API, get categories and store in state
    getCategories = () => {
        const { api_url, categoryToRender: categoryID } = this.props;
        const trimmedURL = api_url.split("wp-json")[0];
        let fetchURL = `${trimmedURL}wp-json/wp/v2/categories?parent=${categoryID}`
        axios.get(fetchURL)
        .then(res => {
            let categoryData = {};
            for(let i = 0; i < res.data.length; i++){
                if(res.data[i].name === "Uncategorised") continue;
                categoryData[res.data[i].id] = res.data[i].name; 
            }
            this.setState({ categoryData })
        })
    }
    // call API, get posts and store in state
    getPosts = () => {
        const { api_url, categoryToRender: categoryID } = this.props;
        const trimmedURL = api_url.split("wp-json")[0];
        const fetchURL = `${trimmedURL}wp-json/wp/v2/posts?categories=${categoryID}&_embed`;
        axios.get(fetchURL)
        .then(res => {
            this.setState({
                postData: res.data,
                dataFetched: true
            })
        })
    }    

    componentDidMount(){
        document.addEventListener("keydown", (event) =>{
            if(event.key === "Escape"){
                this.handleClearSearchBox();
            }
        } )
    }

    componentWillUnmount(){
        document.removeEventListener("keydown");
    }

    // attached to the escape key using componentDidMount()
    handleClearSearchBox = () => {
        this.setState({filterValue: ""})
    }

    stripHTML = indexOrData => {
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

      assignCategories = index => {
          let catFromState = this.state.postData[index].categories;
          let categoryNames = "";
          for(let i = 1; i < catFromState.length; i++){
              categoryNames += this.state.categoryData[catFromState[i]];
              if(i !== catFromState.length -1)categoryNames += " | ";
          }
          return categoryNames;
      }

    prevToggled = () => {
        console.log("Previous toggled");
    }

    nextToggled = () => {
        console.log("Next toggled");
    }

    filterChangeHandler = e => this.setState({ filterValue: e.target.value.toUpperCase()});

    filterItems(){
    const { postData, filterValue } = this.state;
    let sortedFilteredPosts = postData.filter(({ title }) => title.rendered.includes(filterValue));
    return sortedFilteredPosts;
    }

    categoryFilter = event => {
        let element = event.target.name;
        console.log(`${element} clicked!`)
    }

render(){
    if(!this.state.dataFetched && this.props.categoryToRender !== null){
        this.getCategories();
        this.getPosts();
        return(<div><Loading /></div>)
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
            {/* filtered film results */}
            {this.filterItems().map((post, index) => <Post
                key={this.filterItems()[index].id === undefined ? null : this.filterItems()[index].id}
                filmTitle={this.filterItems()[index].title.rendered === undefined ? null : this.filterItems()[index].title.rendered.toUpperCase()}
                filmExcerpt={this.stripHTML(this.filterItems()[index]) === undefined ? null : this.stripHTML(this.filterItems()[index].excerpt.rendered)}  
                filmImage={this.filterItems()[index]._embedded['wp:featuredmedia'] === undefined ? null : this.filterItems()[index]._embedded['wp:featuredmedia'][0].source_url}
                filmLink={this.filterItems()[index].link === undefined ? null : this.filterItems()[index].link}
                filmCategories={this.assignCategories(index) === undefined ? null : this.assignCategories(index)}
            />)}
            </div>
        )
    }


    return(
        <div>
        {this.props.showSearchBar ? <div className="uneekGallerySearchBarContainer"><SearchBar value={this.state.filterValue} onChange={this.filterChangeHandler}/></div> : null}
            <div className="categoryLinks"><h3 id="filterByStageLabel">FILTER BY STAGE: </h3>
            {this.state.categoryData === null ? null : Object.keys(this.state.categoryData).map((key, index) => 
                <a className="categoryLink" onClick={this.categoryFilter} key={this.state.categoryData[key]} name={this.state.categoryData[key]}>{this.state.categoryData[key]}</a>)}
            </div>
        {this.state.postData.map((post, index) => <Post
            key={this.state.postData[index].id === undefined ? null : this.state.postData[index].id}
            filmTitle={this.state.postData[index].title.rendered === undefined ? null : this.state.postData[index].title.rendered.toUpperCase()}
            filmExcerpt={this.stripHTML(index) === undefined ? null : this.stripHTML(index)}    
            filmImage={this.state.postData[index]._embedded['wp:featuredmedia'] === undefined ? null : this.state.postData[index]._embedded['wp:featuredmedia'][0].source_url}
            filmLink={this.state.postData[index].link === undefined ? null : this.state.postData[index].link}
            filmCategories={this.assignCategories(index) === undefined ? null : this.assignCategories(index)}
        />)}
            <div className="nextPrevBar">
                <div className="nextPrevLinks">
                    <a
                    onClick={this.prevToggled}
                    >PREV</a>
                </div>
                <div className="nextPrevLinks">
                    <a
                    onClick={this.nextToggled}
                    >NEXT</a>
                </div>
            </div>
        </div>
    )
}

}