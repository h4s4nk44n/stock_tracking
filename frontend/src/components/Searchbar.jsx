import React from "react"
import '../css/main.css'

function SearchBar() {
    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search stock symbol (e.g., AAPL)"
          className="search-input"
        />
      </div>
    );
  }
  
  export default SearchBar;