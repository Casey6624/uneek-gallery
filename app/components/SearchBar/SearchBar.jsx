import React from "react";

const SearchBar = ({value, onChange}) => {
    
  return (
      <div>
        <input
          id="uneekGallerySearchBar"
          type="text"
          placeholder="SEARCH FOR FILM..."
          value={value}
          onChange={onChange}
        />
      </div>
    );
  };

export default SearchBar;