/* eslint-disable react/prop-types */
import React, { useState } from "react";

export default function Post(props){

    const [btnActive, setBtnActive] = useState(false)
    const [imgHover, setImgHover] = useState(false)

    // set button class on mouse in/mouse out
    function btnHoverOn(){setBtnActive(true)}
    function btnHoverOff(){setBtnActive(false)}

    // set img class on mouse in/mouse out
    function imgHoverOn(){setImgHover(true)}
    function imgHoverOff(){setImgHover(false)}

        return(
            <div className="ds-grid">
            <a href={props.filmLink}><img 
            className={imgHover ? "ds-grid-item filmImageHover" : "ds-grid-item filmImage"} 
            src={props.filmImage}
            onMouseEnter={imgHoverOn}
            onMouseLeave={imgHoverOff}
            /></a>
            <div className="titleAndDescription">
            <div className="titleAndCategory">
                <h1 id="filmTitleID"className="ds-grid-item filmTitle">{props.filmTitle}</h1>
                <p className="filmCategories" >{props.filmCategories}</p>
            </div>
                <p className="ds-grid-item filmExcerpt">{props.filmExcerpt}</p>
                <br />

                <a className={btnActive ? "ds-grid-item btnViewFilmHover" : "ds-grid-item btnViewFilm"} href={props.filmLink} 
            onMouseEnter={btnHoverOn}
            onMouseLeave={btnHoverOff}
            >MORE INFO</a>
            </div>
            <br/>
            <hr className="filmDivider" />
            </div>
        )
    }
