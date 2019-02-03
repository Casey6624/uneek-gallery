import React from "react";

const SearchBar = ({value, onChange}) => {
    
  return (
      <div>
        <input
          id="uneekGallerySearchBar"
          type="text"
          style={{
            textAlign: "center"
          }}
          placeholder="SEARCH BY PRODUCTION NAME"
          value={value}
          onChange={onChange}
        />
      </div>
    );
  };

export default SearchBar;