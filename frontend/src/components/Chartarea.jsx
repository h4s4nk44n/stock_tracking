import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import BoxSelector from "./BoxSelector";
import DataBoxes from "./DataBoxes";
import SearchBarCopy from "./SearchBarCopy";
import { StockContext } from "../context/StockContext";

function ChartArea() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const { selectedStock } = useContext(StockContext); 
  const [selectedOption, setSelectedOption] = useState(() => {
    return localStorage.getItem("selectedOption") || "1d";
  });

  const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.8);
  const [chartHeight, setChartHeight] = useState(window.innerHeight * 0.7);

  useEffect(() => {
    const handleResize = () => setChartWidth(window.innerWidth * 0.8);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => setChartWidth(window.innerHeight * 0.8);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedOption", selectedOption);
    console.log("Selected Option:", selectedOption);
  }, [selectedOption]);

  const stockSymbol = selectedStock?.symbol || symbol; // ✅ Use selectedStock if available, otherwise fallback to useParams()

  useEffect(() => {
    if (!stockSymbol) return;

    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch(`http://127.0.0.1:5000/stocks/${symbol}?interval=${selectedOption}`);
        if (!response.ok) {
          throw new Error("Stock data not found");
        }
        const data = await response.json();
  
        console.log("API Response Dates:", data.dates); // ✅ Debug API Response
        //"close_prices": close_prices,
        //"open_prices": open_prices,
        //"symbol": symbol,
        //"high_prices": high_prices,
        //"low_prices": low_prices,
        //"volume":volume,
        const formattedData = data.dates.map((date, index) => ({
          date, // Keep date as string
          price: data.close_prices[index],
          open_price: data.open_prices[index],
          symbol: data.symbol[index],
          high_prices: data.high_prices[index],
          low_prices: data.low_prices[index],
          volume: data.volume[index]
        }));
  
        setStockData(formattedData);

        if (formattedData.length > 0) {
          setSelectedDate(formattedData[formattedData.length - 1]);
        }

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStockData();
  }, [symbol, selectedOption]);
  

  if (loading) return <p>Loading stock data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!stockData || stockData.length === 0) return <p>No data available</p>;

  const minValue = Math.min(...stockData.map(d => d.price));
  const maxValue = Math.max(...stockData.map(d => d.price));

  const adjustedMin = Number((minValue).toFixed(4));
  const adjustedMax = Number((maxValue + maxValue * 0.01).toFixed(4)); 

  const CustomTooltip = ({ active, payload, label, selectedOption }) => {
    console.log("CustomTooltip - selectedOption:", selectedOption); // ✅ Debugging
  
    if (active && payload && payload.length) {
      let formattedTime = String(label); // ✅ Ensure `label` is a string
  
      if (formattedTime.includes(" ")) {
        const [datePart, timePart] = formattedTime.split(" "); // ✅ Extract Date & Time
  
        if (selectedOption === "1d") { 
          formattedTime = timePart; // ✅ Show only HH:mm for "Today"
        } else if(selectedOption === "1y" || "10y") {
          formattedTime = datePart;
        } else {
          formattedTime = `${datePart} ${timePart}`; // ✅ Show full date + time
        }
      }
  
      return (
        <div className="bg-black p-2 rounded shadow-md text-white">
          <p className="font-bold">{`Time: ${formattedTime}`}</p> {/* ✅ Show Correct Format */}
          <p>{`Price: $${payload[0].value.toFixed(4)}`}</p> {/* ✅ Show price */}
        </div>
      );
    }
    return null;
  };
  
  const formatXAxis = (tick, selectedOption) => {
    if (!tick) return ""; // Ensure tick is valid
  
    // Convert tick to string (in case it's not)
    const tickStr = String(tick);
  
    if (selectedOption === "1d") {
      // ✅ Show only hours & minutes if "Today" is selected
      return tickStr.includes(" ") ? tickStr.split(" ")[1].slice(0, 5) : tickStr;
    } else {
      // ✅ Show only date for all other options
      return tickStr.includes(" ") ? tickStr.split(" ")[0] : tickStr;
    }
  };
  
  const getSpacedTicks = (data, numTicks) => {
    if (data.length === 0) return [];
  
    const uniqueDates = Array.from(new Set(data.map(d => d.date))); // ✅ Remove duplicates
    const tickStep = Math.max(1, Math.floor(uniqueDates.length / numTicks));
    
    let spacedTicks = uniqueDates.filter((_, index) => index % tickStep === 0);
  
    // ✅ Ensure first & last date are always included
    if (!spacedTicks.includes(uniqueDates[0])) spacedTicks.unshift(uniqueDates[0]);
    if (!spacedTicks.includes(uniqueDates[uniqueDates.length - 1])) spacedTicks.push(uniqueDates[uniqueDates.length - 1]);
  
    return spacedTicks;
  };
  
  const handleChartClick = (event) => {
    if (event && event.activeLabel) {
      const clickedDate = event.activeLabel;
      const clickedData = stockData.find((d) => d.date === clickedDate);

      if (clickedData) {
        setSelectedDate(clickedData); // ✅ Store selected data
      }
    }
  }; 

  return (
    <div className="flex flex-col w-screen min-h-screen items-center p-0 m-0">
      {/* Top Section: Contains SearchBar + Selection Boxes */}
      <div className="w-full flex flex-col items-center mt-4">
        {/* Larger Search Bar Centered */}
        <div className="w-full max-w-3xl">
          <SearchBarCopy />
        </div>

        {/* Selection Boxes Aligned to the Right */}
        <div className="w-76/100 flex justify-end mt-4">
          <BoxSelector onSelect={setSelectedOption} initialSelected={selectedOption} />
        </div>
        <div className="self-start w-full text-left ml-65">
          <p><strong>symbol:</strong> {selectedDate.symbol}</p>
        </div>
      </div>
      

      {/* Chart Centered */}
      <div className="w-4/5 mx-auto">
        <LineChart
          width={chartWidth}
          height={chartHeight}
          data={stockData}
          margin={{ top: 10, right: 50, left: 20, bottom: 50 }} // ✅ Extra space for labels
          onClick={handleChartClick}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis} 
            ticks={getSpacedTicks(stockData, 15)} // ✅ Custom spacing
            interval="preserveStartEnd" // ✅ Keeps first & last label
            angle={-45} // ✅ Rotates for readability
            domain={["dataMin", "dataMax"]} 
            tick={{ fill: "#FFFFFF", fontSize: 14 }}
            dx={-10} 
            dy={20}
            scale="band"
            />
          <YAxis 
            domain={[adjustedMin, adjustedMax]}
            tickFormatter={(tick) => tick.toFixed(4)}
            tickCount={6}
            tick={{ fill: "#FFFFFF", fontSize: 14 }}
            />
          <Tooltip content={(props) => <CustomTooltip {...props} selectedOption={selectedOption} />} />
          <Line type="bump" dataKey="price" stroke="#8884d8" dot={false} />
        </LineChart>
      </div>
      <DataBoxes selectedOption={selectedOption} date={selectedDate} data={stockData}></DataBoxes>
    </div>
  );
}

export default ChartArea;
