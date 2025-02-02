import React, { createContext, useState, useEffect } from "react";

// ✅ Create Stock Context
export const StockContext = createContext();

export const StockProvider = ({ children }) => {
    const [stockNames, setStockNames] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/")
            .then((response) => response.json())
            .then((data) => {
                if (!Array.isArray(data)) throw new Error("Invalid API response");
                setStockNames(data);
            })
            .catch((error) => console.error("❌ Error fetching stock symbols:", error));
    }, []);

    return (
        <StockContext.Provider value={{ stockNames, selectedStock, setSelectedStock }}>
            {children}
        </StockContext.Provider>
    );
};
