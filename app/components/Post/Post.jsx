import React, {Component} from "react";

class Post extends Component{

        state = {
            btnActive: false,
            imgHover: false
        }

    

    btnHoverOn = () => this.setState({btnActive: true});

    btnHoverOff = () => this.setState({btnActive: false});

    imgHoverOn = () => this.setState({imgHover: true});

    imgHoverOff = () => this.setState({imgHover: false});

    render(){
        return(
            <div className="ds-grid">
            <a href={this.props.filmLink}><img 
            className={this.state.imgHover ? "ds-grid-item filmImageHover" : "ds-grid-item filmImage"} 
            src={this.props.filmImage}
            onMouseEnter={this.imgHoverOn}
            onMouseLeave={this.imgHoverOff}
            /></a>
            <div className="titleAndDescription">
            <div className="titleAndCategory">
                <h1 id="filmTitleID"className="ds-grid-item filmTitle">{this.props.filmTitle}</h1>
                <p className="filmCategories" >{this.props.filmCategories}</p>
            </div>
                <p className="ds-grid-item filmExcerpt">{this.props.filmExcerpt}</p>
                <br />

                <a className={this.state.btnActive ? "ds-grid-item btnViewFilmHover" : "ds-grid-item btnViewFilm"} href={this.props.filmLink} 
            onMouseEnter={this.btnHoverOn}
            onMouseLeave={this.btnHoverOff}
            >MORE INFO</a>
            </div>
            <br/>
            <hr className="filmDivider" />
            </div>
        )
    }

}


export default Post; 