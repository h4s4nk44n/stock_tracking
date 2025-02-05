import React, {useState, useEffect, useContext, useRef} from "react"
import '../css/main.css'
import {useNavigate} from "react-router-dom"
import { motion } from "framer-motion";
import { StockContext } from "../context/StockContext"; 

function SearchBarCopy() {
    const[istyping, setIsTyping] = useState(false);
    const[query, setQuery] = useState("");
    const[filteredResults, setFilteredResults] = useState([]);
    const keyPressRef = useRef(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const { stockNames, selectedStock } = useContext(StockContext);
    const navigate = useNavigate(); 

    useEffect(() => {
      if (!stockNames || stockNames.length === 0) return;

      if (query.length > 0) {
          const filtered = stockNames
              .filter(stock => stock && stock.symbol && stock.name)
              .filter(stock =>
                  stock.name.toLowerCase().includes(query.toLowerCase()) ||
                  stock.symbol.toLowerCase().includes(query.toLowerCase())
              );
          
          console.log("🔍 Filtered Results:", filtered);
          setFilteredResults(filtered);
      } else {
          setFilteredResults([]);
      }
  }, [query, stockNames]);

  const handleKeyDown = (e) => {
    if (filteredResults.length === 0) return;
  
    if (keyPressRef.current) return; 
    keyPressRef.current = true;
  
    setTimeout(() => (keyPressRef.current = false), 100); 

    if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prevIndex) => 
            prevIndex < filteredResults.length - 1 ? prevIndex + 1 : 0
        );
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prevIndex) => 
            prevIndex > 0 ? prevIndex - 1 : filteredResults.length - 1
        );
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0 && filteredResults[selectedIndex]) {
            setQuery(filteredResults[selectedIndex].symbol);
            setIsTyping(false);
            navigate(`/${filteredResults[selectedIndex].symbol}`);
            setSelectedIndex(-1);
        } else {
            navigate(`/${query.trim().toUpperCase()}`);
        }
    }
  };
    
    return (
      <div className="relative top-0 left-0 w-full z-50 p-1 mt-0 pt-0 flex justify-center">
        <form className="w-full max-w-2xl relative">
          <label htmlFor="simple-search" className="sr-only">Search</label>

          <div className="relative w-full">

            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg width="2em" height="2em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M4 9V7.2C4 6.0799 4 5.51984 4.21799 5.09202C4.40973 4.71569 4.71569 4.40973 5.09202 4.21799C5.51984 4 6.07989 4 7.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V16.8C20 17.9201 20 18.4802 19.782 18.908C19.5903 19.2843 19.2843 19.5903 18.908 19.782C18.4802 20 17.9201 20 16.8 20H10.5M11 16H17M8 11L11 9V12L17 7M17 7H14M17 7V10M7 14.5C6.5 14.376 5.68509 14.3714 5 14.376C4.77091 14.3775 4.90941 14.3678 4.6 14.376C3.79258 14.4012 3.00165 14.7368 3 15.6875C2.99825 16.7004 4 17 5 17C6 17 7 17.2312 7 18.3125C7 19.1251 6.1925 19.4812 5.1861 19.5991C4.3861 19.5991 4 19.625 3 19.5M5 20V21M5 13V14" 
                  stroke="#ffffff" 
                  strokeWidth="1" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-m rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full ps-20 pr-16 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search stock symbol (e.g., AAPL)"
              value={query}
              onChange = {(e) => setQuery(e.target.value)}
              onFocus = {() => setIsTyping(true)}
              onBlur={() => setTimeout(() => setIsTyping(false), 200)}
              onKeyDown={handleKeyDown}
              required
              autoComplete = "off"
            />

            <button
              type="submit"
              className="absolute right-0 top-0 h-full w-12 flex items-center justify-center rounded-r-xl bg-transparent border-none"
              style={{ background: "transparent", border: "none" }}
            >
              <svg width="2em" height="2em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                  stroke="#ffffff" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {istyping && filteredResults.length > 0 && (
            <motion.ul
              className="absolute top-full left-0 w-full max-h-60 overflow-y-auto bg-gray-800 text-white rounded-xl shadow-lg mt-2 z-50 opacity-95"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filteredResults.map((stock, index) => (
                            stock?.symbol && stock?.name ? (
                                <li
                                    key={index}
                                    className={`p-3 hover:bg-gray-700 cursor-pointer ${
                                        index === selectedIndex ? "bg-blue-500 text-white" : ""
                                    }`}
                                    onMouseDown={() => {
                                        setQuery(stock.symbol);
                                        setFilteredResults([]);
                                        navigate(`/${stock.symbol}`);
                                    }}
                                >
                                    <span className="font-bold">{stock.symbol}</span> - {stock.name}
                                </li>
                            ) : null
                        ))}              
            </motion.ul>
          )}
          </div>
        </form>  
      </div>
    );
  }
  
  export default SearchBarCopy;