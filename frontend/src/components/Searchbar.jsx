import React, {useState, useEffect} from "react"
import '../css/main.css'
import {useNavigate} from "react-router-dom"
import { motion } from "framer-motion";

const stockNames = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
];

function SearchBar() {
    const[istyping, setIsTyping] = useState(false);
    const[query, setQuery] = useState("");
    const[filteredResults, setFilteredResults] = useState([]);

    const navigate = useNavigate(); // ✅ Initialize useNavigate inside the component

    useEffect(() => {
      if(query.length > 0){
        const filtered = stockNames.filter(stock => 
          stock.name.toLowerCase().includes(query.toLowerCase()) ||
          stock.symbol.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredResults(filtered);
      } else {
        setFilteredResults([]);
      }
    }, [query]);
    
    const handleSearch = (e) => {
      e.preventDefault();
      console.log("Navigating to: ", `/${query.trim().toUpperCase()}`); // ✅ Debugging log
      if (query.trim() !== "") {
        navigate(`/${query.trim().toUpperCase()}`); // ✅ Redirects to "/AAPL"
      }
    };
    
    return (
      <div className="flex justify-center w-full">
        <motion.form
        initial={{ y: 0 }}
        animate={{
          y: istyping ? "-400%" : "0%",
          width: istyping ? "60vw" : "50vw",
        }}
        transition={{ type: "spring", stiffness: 60 }}
        className="relative"
        onSubmit={handleSearch}
      >
            <label htmlFor="simple-search" className="sr-only">Search</label>

            <div className="relative w-full">
              {/* Cloud Icon (Left Inside Input) */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg width="3em" height="3em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M4 9V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.07989 4 7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.8C20 17.9201 20 18.4802 19.782 18.908C19.5903 19.2843 19.2843 19.5903 18.908 19.782C18.4802 20 17.9201 20 16.8 20H10.5M11 16H17M8 11L11 9V12L17 7M17 7H14M17 7V10M7 14.5C6.5 14.376 5.68509 14.3714 5 14.376C4.77091 14.3775 4.90941 14.3678 4.6 14.376C3.79258 14.4012 3.00165 14.7368 3 15.6875C2.99825 16.7004 4 17 5 17C6 17 7 17.2312 7 18.3125C7 19.1251 6.1925 19.4812 5.1861 19.5991C4.3861 19.5991 4 19.625 3 19.5M5 20V21M5 13V14" 
                    stroke="#ffffff"  // ✅ Change stroke color if needed
                    strokeWidth="1" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Input Field */}
              <input
                type="text"
                id="simple-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-3xl rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-20 pr-16 p-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search stock symbol (e.g., AAPL)"
                value={query}
                onChange = {(e) => setQuery(e.target.value)}
                onFocus = {() => setIsTyping(true)}
                onBlur={() => setTimeout(() => setIsTyping(false), 200)}
                required
                autoComplete = "off"
              />

              {/* Search Button (Right Inside Input) */}
              <button
                type="submit"
                className="absolute right-0 top-0 h-full w-16 flex items-center justify-center rounded-r-xl bg-transparent border-none"
                style={{ background: "transparent", border: "none" }} // ✅ Ensures transparency
              >
                <svg width="24px" height="24px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                    stroke="#ffffff"  // ✅ Change stroke color if needed
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {istyping && filteredResults.length > 0 && (
                <motion.ul
                  className="absolute top-full left-0 w-full bg-gray-800 text-white rounded-xl shadow-lg mt-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {filteredResults.map((stock, index) => (
                    <li
                      key={index}
                      className="p-3 hover:bg-gray-700 cursor-pointer"
                      onMouseDown={() => setQuery(stock.symbol)} // Set the input to selected stock symbol
                    >
                      <span className="font-bold">{stock.symbol}</span> - {stock.name}
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>
        </motion.form>
      </div>
    );
  }
  
  export default SearchBar;