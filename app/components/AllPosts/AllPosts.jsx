/* eslint-disable react/prop-types */
// Libaries
import React, { useState, useEffect } from "react";
import axios from "axios";
// Components
import Loading from "../Loading/Loading";
import Post from "../Post/Post";
import SearchBar from "../SearchBar/SearchBar";

export default function AllPosts(props) {

    const [postData, setPostData] = useState([])
    const [dataFetched, setDataFetched] = useState(false)
    const [filterValue, setFilterValue] = useState("")
    const [categoryData, setCategoryData] = useState(null)
    const [categoryFilter, setCategoryFilter] = useState(null)
    const [categoryFilterNoResults, setCategoryFilterNoResults] = useState(false)
    const [activeCategory, setActiveCategory] = useState("ALL")
    const [parentCategory, setParentCategory] = useState(null)

    // Essentially a componentDidMount()
    useEffect(() => {
        const { api_url, categoryToRender: categoryID } = props;
        const [trimmedURL] = api_url.split("wp-json");

        const getParentURL = `${trimmedURL}wp-json/wp/v2/categories?parent=${categoryID}`
        const getChildrenURL = `${trimmedURL}wp-json/wp/v2/categories?parent=${categoryID}`
        const getPostsUrl = `${trimmedURL}wp-json/wp/v2/posts?categories=${categoryID}&_embed`

        axios.all([
            axios.get(getParentURL),
            axios.get(getChildrenURL),
            axios.get(getPostsUrl)
        ])
            .then(axios.spread((parentRes, childrenRes, postsRes) => {
                if (parentRes) {
                    setParentCategory(parentRes.data.name)
                }
                if (childrenRes) {
                    let categoryData = { 1: "ALL" };
                    for (let i = 0; i < childrenRes.data.length; i++) {
                        if (childrenRes.data[i].name === "Uncategorised") continue;
                        categoryData[childrenRes.data[i].id] = childrenRes.data[i].name;
                    }
                    setCategoryData(categoryData)
                }
                if (postsRes) {
                    setPostData(postsRes.data)
                    setDataFetched(true)
                }
            }))



        // add event listner to clear searchbox input
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                handleClearSearchBox(event);
            }
        })
    }, [])

    // attached to the escape key using componentDidMount()
    function handleClearSearchBox() { setFilterValue("") }

    function stripHTML(indexOrData) {
        let rawData;
        if (Number.isInteger(indexOrData)) {
            rawData = postData[indexOrData].excerpt.rendered;
        } else { rawData = indexOrData }
        return new DOMParser()
            .parseFromString(rawData, 'text/html')
            .body
            .textContent
            .trim()
    }

    function assignCategories(index) {
        let catFromState = postData[index].categories
        let categoryNames = "";
        for (let i = 0; i < catFromState.length; i++) {
            if (categoryData[catFromState[i]] == parentCategory) continue
            if (categoryData[catFromState[i]] == undefined) continue
            categoryNames += categoryData[catFromState[i]];
        }
        return categoryNames;
    }

    function paginationToggled(event) { let el = event.target.name }

    function filterChangeHandler(e) { setFilterValue(e.target.value.toUpperCase()) }

    // TEXT SEARCH
    function filterItems() {
        let sortedFilteredPosts = postData.filter(({ title }) => title.rendered.toUpperCase().includes(filterValue));
        return sortedFilteredPosts;
    }
    // CATEGORY <a> TAGS </a> SEARCH
    function categoryFilterItems() {
        let filteredCategories = postData.filter(category => {
            // making this [0] fixes crowd funding category filter
            let categoryFinal;
            for (let i = 0; i < category.categories.length; i++) {
                if (category.categories[i] == props.categoryToRender) continue
                if (category.categories[i] == undefined) continue
                categoryFinal = category.categories[i]
            }
            return categoryFinal == categoryFilter
        })
        return filteredCategories
    }

    function categoryFilterHandler(event) {
        let element = event.target.name
        // if null name then use value (for dropdown list)
        if (!element) element = event.target.value
        let catStateObj = categoryData;
        let catId = Object.keys(catStateObj).find(key => catStateObj[key] === element)
        if (element === "ALL") catId = null;
        setCategoryFilter(catId)
        setActiveCategory(element)
    }

    if (!dataFetched && props.categoryToRender !== null) {
        return (<div><Loading /></div>)
    }

    if (dataFetched && postData.length === 0) {
        return (
            <div className="noPostsFound">
                <h1 >No Posts Found! :(</h1>
                <p>Please visit <strong>Settings/Uneek Gallery</strong> from the dashboard and check the parent category is correct.</p>
            </div>
        )
    }

    if (filterValue !== "") {
        return (
            <React.Fragment>
                <SearchBar focus value={filterValue} onChange={filterChangeHandler} />
                {/* filtered film results */}
                {filterItems().map((post, index) => <Post
                    key={filterItems()[index].id === undefined ? null : filterItems()[index].id}
                    filmTitle={filterItems()[index].title.rendered === undefined ? null : filterItems()[index].title.rendered.toUpperCase()}
                    filmExcerpt={stripHTML(filterItems()[index]) === undefined ? null : stripHTML(filterItems()[index].excerpt.rendered)}
                    filmImage={filterItems()[index]._embedded['wp:featuredmedia'] === undefined ? null : filterItems()[index]._embedded['wp:featuredmedia'][0].source_url}
                    filmLink={filterItems()[index].link === undefined ? null : filterItems()[index].link}
                    filmCategories={assignCategories(index) === undefined ? null : assignCategories(index)}
                />)}
                {<h4 className="resultsFoundText">{`${filterItems().length} ${filterItems().length === 1 ? "RESULT" : "RESULTS"} FOUND`}</h4>}
            </React.Fragment>
        )
    }

    if (categoryFilter !== null) {
        return (
            <React.Fragment>
                <SearchBar focus value={filterValue} onChange={filterChangeHandler} />
                <div className="categoryLinks">
                    {categoryData === null ? null : Object.keys(categoryData).map((key, index) =>
                        <a className={activeCategory == categoryData[key] ? "categoryLinkActive" : "categoryLink"} onClick={categoryFilterHandler} key={categoryData[key]} name={categoryData[key]}>{categoryData[key]}</a>)}

                    <select className="categoryLinksDropDown" onChange={categoryFilterHandler}>
                        {categoryData === null ? null : Object.keys(categoryData).map((key, index) =>
                            <option key={categoryData[key]} value={categoryData[key]} name={categoryData[key]}>{categoryData[key]}</option>
                        )}
                    </select>
                </div>
                {/* filtered film results */}
                {categoryFilterItems().map((post, index) => <Post
                    key={categoryFilterItems()[index].id === undefined ? null : categoryFilterItems()[index].id}
                    filmTitle={categoryFilterItems()[index].title.rendered === undefined ? null : categoryFilterItems()[index].title.rendered.toUpperCase()}
                    filmExcerpt={stripHTML(categoryFilterItems()[index]) === undefined ? null : stripHTML(categoryFilterItems()[index].excerpt.rendered)}
                    filmImage={categoryFilterItems()[index]._embedded['wp:featuredmedia'] === undefined ? null : categoryFilterItems()[index]._embedded['wp:featuredmedia'][0].source_url}
                    filmLink={categoryFilterItems()[index].link === undefined ? null : categoryFilterItems()[index].link}
                //filmCategories={assignCategories(index) === undefined ? null : assignCategories(categoryFilterItems()[index])}
                />)}
                {<h4 className="resultsFoundText">{`${categoryFilterItems().length} ${categoryFilterItems().length === 1 ? "RESULT" : "RESULTS"} FOUND FOR ${activeCategory}`}</h4>}
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            {<SearchBar focus value={filterValue} onChange={filterChangeHandler} />}
            <div className="categoryLinks">
                {categoryData === null ? null : Object.keys(categoryData).map((key, index) =>
                    <a className={activeCategory == categoryData[key] ? "categoryLinkActive" : "categoryLink"} onClick={categoryFilterHandler} key={categoryData[key]} name={categoryData[key]}>{categoryData[key]}</a>)}

                <select className="categoryLinksDropDown" onChange={categoryFilterHandler}>
                    {categoryData === null ? null : Object.keys(categoryData).map((key, index) =>
                        <option key={categoryData[key]} value={categoryData[key]} name={categoryData[key]}>{categoryData[key]}</option>
                    )}
                </select>

            </div>
            {postData.map((post, index) => <Post
                key={postData[index].id === undefined ? null : postData[index].id}
                filmTitle={postData[index].title.rendered === undefined ? null : postData[index].title.rendered.toUpperCase()}
                filmExcerpt={stripHTML(index) === undefined ? null : stripHTML(index)}
                filmImage={postData[index]._embedded['wp:featuredmedia'] === undefined ? null : postData[index]._embedded['wp:featuredmedia'][0].source_url}
                filmLink={postData[index].link === undefined ? null : postData[index].link}
                filmCategories={assignCategories(index) === undefined ? null : assignCategories(index)}
            />)}
            {<h4 className="resultsFoundText">{`${postData.length} ${postData.length === 1 ? "RESULT" : "RESULTS"} FOUND FOR ${activeCategory}`}</h4>}
        </React.Fragment>
    )
}