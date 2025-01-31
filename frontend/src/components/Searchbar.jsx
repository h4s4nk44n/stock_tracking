import React from "react"
import '../css/main.css'
import searchicon from '../assets/search_icon.svg'
import stock from '../assets/stock.svg'
function SearchBar() {
    return (
      <form className="flex items-center max-w-[50vw] w-full mx-auto search-bar">
        <label htmlFor="simple-search" className="sr-only">Search</label>

        <div className="relative w-full">
          {/* Cloud Icon (Left Inside Input) */}
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <img src={stock} alt="Cloud Icon" className="w-12 h-12" />
          </div>

          {/* Input Field */}
          <input
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-3xl rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-20 pr-16 p-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search stock symbol (e.g., AAPL)"
            required
          />

          {/* Search Button (Right Inside Input) */}
          <button
            type="submit"
            className="absolute right-0 top-0 h-full w-16 flex items-center justify-center bg-gray-50 border-l border-gray-300 rounded-r-xl dark:bg-gray-700 dark:border-gray-600"
          >
            <img src={searchicon} alt="Search Icon" className="w-12 h-12" />
          </button>
        </div>
      </form>
    );
  }
  
  export default SearchBar;