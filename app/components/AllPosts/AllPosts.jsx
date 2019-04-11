// Libaries
import React, { Component } from "react";
import axios from "axios";
// Components
import Loading from "../Loading/Loading";
import Post from "../Post/Post";
import SearchBar from "../SearchBar/SearchBar";
import { throws } from "assert";

export default class AllPosts extends Component{

    state = {
        postData: [],
        dataFetched: false,
        filterValue: "",
        categoryData: null,
        categoryFilter: null,
        categoryFilterNoResults: false,
        activeCategory: "ALL",
        parentCategory: null
    } 

    getParentCategory = () => {
        const { api_url, categoryToRender: categoryID } = this.props;
        const trimmedURL = api_url.split("wp-json")[0];
        axios.get(`${trimmedURL}wp-json/wp/v2/categories/${categoryID}`)
        .then( res => {
            this.setState({ parentCategory: res.data.name })
        })
    }

    getCategories = () => {
        const { api_url, categoryToRender: categoryID } = this.props;
        const trimmedURL = api_url.split("wp-json")[0];
        let fetchURL = `${trimmedURL}wp-json/wp/v2/categories?parent=${categoryID}`
        axios.get(fetchURL)
        .then(res => {
            let categoryData = {1: "ALL"};
            for(let i = 0; i < res.data.length; i++){
                if(res.data[i].name === "Uncategorised") continue;
                categoryData[res.data[i].id] = res.data[i].name; 
            }
            this.setState({ categoryData })
        })
        this.getParentCategory();
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
                dataFetched: true,
            })
        })
    }    

    componentDidMount(){
        document.addEventListener("keydown", (event) =>{
            if(event.key === "Escape"){
                this.handleClearSearchBox(event);
            }
        } )
    }
    // attached to the escape key using componentDidMount()
    handleClearSearchBox = () => this.setState({filterValue: ""})

    stripHTML = indexOrData => {
        let rawData;
        if(Number.isInteger(indexOrData)){
            rawData = this.state.postData[indexOrData].excerpt.rendered;
        }else{rawData = indexOrData}
        return new DOMParser()
          .parseFromString(rawData, 'text/html')
          .body
          .textContent
          .trim()
      }

      assignCategories = index => {
        let catFromState = this.state.postData[index].categories;
        let categoryNames = "";
        for(let i = 0; i < catFromState.length; i++){
            if(this.state.categoryData[catFromState[i]] == this.state.parentCategory) continue
            if(this.state.categoryData[catFromState[i]] == undefined) continue
            categoryNames += this.state.categoryData[catFromState[i]];
        }
        return categoryNames;
    }

    paginationToggled = event => {let el = event.target.name;console.log(`${el} has been fired!`)}
    
    filterChangeHandler = e => this.setState({ filterValue: e.target.value.toUpperCase()});

    // TEXT SEARCH
    filterItems = () =>{
    const { postData, filterValue } = this.state;
    let sortedFilteredPosts = postData.filter(({ title }) => title.rendered.includes(filterValue));
    return sortedFilteredPosts;
    }
    // CATEGORY <a> TAGS </a> SEARCH
    categoryFilterItems = () =>{
        let { postData, categoryFilter } = this.state;
        let filteredCategories = postData.filter(category =>{
            // making this [0] fixes crowd funding category filter
            let categoryFinal;
            for(let i = 0; i < category.categories.length; i++){
                if (category.categories[i] == this.props.categoryToRender) continue
                if (category.categories[i] == undefined) continue
                categoryFinal = category.categories[i]
            }
            return categoryFinal == categoryFilter
        })
        return filteredCategories
    }

    categoryFilterHandler = event => {
        let element = event.target.name
        // if null name then use value (for dropdown list)
        if(!element) element = event.target.value
        let catStateObj = this.state.categoryData;
        let catId = Object.keys(catStateObj).find(key  => catStateObj[key] === element)
        if(element === "ALL") catId = null;
        this.setState({categoryFilter: catId, activeCategory: element})
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
                <p>Please visit <strong>Settings/Uneek Gallery</strong> from the dashboard and check the parent category is correct.</p>
            </div>
        )
    }

    if(this.state.filterValue !== ""){
        return(
            <React.Fragment>
                <div className="uneekGallerySearchBarContainer">
                    <SearchBar focus value={this.state.filterValue} onChange={this.filterChangeHandler} />
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
            {<h4 className="resultsFoundText">{`${this.filterItems().length} ${this.filterItems().length === 1 ? "RESULT" : "RESULTS"} FOUND`}</h4>}
            </React.Fragment>
        )
    }

    if(this.state.categoryFilter !== null){
        return(
            <React.Fragment>
                <div className="uneekGallerySearchBarContainer">
                    <SearchBar focus value={this.state.filterValue} onChange={this.filterChangeHandler}/>
                </div>
                <div className="categoryLinks"><h3 id="filterByStageLabel">FILTER BY STAGE: </h3>
            {this.state.categoryData === null ? null : Object.keys(this.state.categoryData).map((key, index) => 
                <a className={this.state.activeCategory == this.state.categoryData[key] ? "categoryLinkActive" : "categoryLink"} onClick={this.categoryFilterHandler} key={this.state.categoryData[key]} name={this.state.categoryData[key]}>{this.state.categoryData[key]}</a>)}
            
            <select className="categoryLinksDropDown" onChange={this.categoryFilterHandler}>
            {this.state.categoryData === null ? null : Object.keys(this.state.categoryData).map((key, index) => 
                <option key={this.state.categoryData[key]} value={this.state.categoryData[key]} name={this.state.categoryData[key]}>{this.state.categoryData[key]}</option>
                )}
            </select>
            </div>
            {/* filtered film results */}
            {this.categoryFilterItems().map((post, index) => <Post
                key={this.categoryFilterItems()[index].id === undefined ? null : this.categoryFilterItems()[index].id}
                filmTitle={this.categoryFilterItems()[index].title.rendered === undefined ? null : this.categoryFilterItems()[index].title.rendered.toUpperCase()}
                filmExcerpt={this.stripHTML(this.categoryFilterItems()[index]) === undefined ? null : this.stripHTML(this.categoryFilterItems()[index].excerpt.rendered)}  
                filmImage={this.categoryFilterItems()[index]._embedded['wp:featuredmedia'] === undefined ? null : this.categoryFilterItems()[index]._embedded['wp:featuredmedia'][0].source_url}
                filmLink={this.categoryFilterItems()[index].link === undefined ? null : this.categoryFilterItems()[index].link}
                //filmCategories={this.assignCategories(index) === undefined ? null : this.assignCategories(this.categoryFilterItems()[index])}
            />)}
            {<h4 className="resultsFoundText">{`${this.categoryFilterItems().length} ${this.categoryFilterItems().length === 1 ? "RESULT" : "RESULTS"} FOUND FOR ${this.state.activeCategory}`}</h4>}
            </React.Fragment>
        )
    }

    return(
        <React.Fragment>
        {<div className="uneekGallerySearchBarContainer"><SearchBar focus value={this.state.filterValue} onChange={this.filterChangeHandler}/></div>}
        <div className="categoryLinks"><h3 id="filterByStageLabel">FILTER BY STAGE: </h3>
            {this.state.categoryData === null ? null : Object.keys(this.state.categoryData).map((key, index) => 
                <a className={this.state.activeCategory == this.state.categoryData[key] ? "categoryLinkActive" : "categoryLink"} onClick={this.categoryFilterHandler} key={this.state.categoryData[key]} name={this.state.categoryData[key]}>{this.state.categoryData[key]}</a>)}
            
            <select className="categoryLinksDropDown" onChange={this.categoryFilterHandler}>
            {this.state.categoryData === null ? null : Object.keys(this.state.categoryData).map((key, index) => 
                <option key={this.state.categoryData[key]} value={this.state.categoryData[key]} name={this.state.categoryData[key]}>{this.state.categoryData[key]}</option>
                )}
            </select>

            </div>
        {this.state.postData.map((post, index) => <Post
            key={this.state.postData[index].id === undefined ? null : this.state.postData[index].id}
            filmTitle={this.state.postData[index].title.rendered === undefined ? null : this.state.postData[index].title.rendered.toUpperCase()}
            filmExcerpt={this.stripHTML(index) === undefined ? null : this.stripHTML(index)}    
            filmImage={this.state.postData[index]._embedded['wp:featuredmedia'] === undefined ? null : this.state.postData[index]._embedded['wp:featuredmedia'][0].source_url}
            filmLink={this.state.postData[index].link === undefined ? null : this.state.postData[index].link}
            filmCategories={this.assignCategories(index) === undefined ? null : this.assignCategories(index)}
        />)}
        {<h4 className="resultsFoundText">{`${this.state.postData.length} ${this.state.postData.length === 1 ? "RESULT" : "RESULTS"} FOUND FOR ${this.state.activeCategory}`}</h4>}
        </React.Fragment>
    )
}

}