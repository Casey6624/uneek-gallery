import React from "react";

const SearchBar = ({value, onChange}) => {
    
  return (
      <div className="uneekGallerySearchBarContainer">
        <input
          id="uneekGallerySearchBar"
          type="text"
          placeholder="SEARCH BY PRODUCTION NAME"
          value={value}
          onChange={onChange}
        />
      </div>
    );
  };

export default SearchBar;