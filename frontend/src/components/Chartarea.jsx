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
  const [selectedDate, setSelectedDate] = useState({});
  const {selectedStock} = useContext(StockContext); 
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

  const stockSymbol = selectedStock?.symbol || symbol;

  useEffect(() => {
    if (!stockSymbol) return;

    const fetchStockData = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch(`http://127.0.0.1:5000/stocks/${stockSymbol}?period=${selectedOption}`);
        if (!response.ok) {
          throw new Error("Stock data not found");
        }
        const data = await response.json();
  
        setStockData(data);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStockData();
  }, [stockSymbol, selectedOption]);

  useEffect(() => {
    if (stockData.length > 0) {
      setSelectedDate(stockData[stockData.length - 1]);
    }
  }, [stockData]);

  if (loading) return <p>Loading stock data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!stockData || stockData.length === 0) return <p>No data available</p>;

  const minValue = Math.min(...stockData.map(d => d.close));
  const maxValue = Math.max(...stockData.map(d => d.close));

  const adjustedMin = Number((minValue).toFixed(4));
  const adjustedMax = Number((maxValue + maxValue * 0.01).toFixed(4)); 

  const CustomTooltip = ({ active, payload, label, selectedOption }) => {
    console.log("CustomTooltip - selectedOption:", selectedOption); 
  
    if (active && payload && payload.length) {
      let formattedTime = String(label);
  
      if (formattedTime.includes(" ")) {
        const [datePart, timePart] = formattedTime.split(" "); 
  
        if (selectedOption === "1d") { 
          formattedTime = timePart; 
        } else if(selectedOption === "1y" || "10y") {
          formattedTime = datePart;
        } else {
          formattedTime = `${datePart} ${timePart}`;
        }
      }
  
      return (
        <div className="bg-black p-2 rounded shadow-md text-white">
          <p className="font-bold">{`Time: ${formattedTime}`}</p> 
          <p>{`Price: $${payload[0].value.toFixed(4)}`}</p>
        </div>
      );
    }
    return null;
  };
  
  const formatXAxis = (tick, selectedOption) => {
    if (!tick) return ""; 
  
    const tickStr = String(tick);
  
    if (selectedOption === "1d") {

      return tickStr.includes(" ") ? tickStr.split(" ")[1].slice(0, 5) : tickStr;
    } else {

      return tickStr.includes(" ") ? tickStr.split(" ")[0] : tickStr;
    }
  };
  
  const getSpacedTicks = (data, numTicks) => {
    if (data.length === 0) return [];
  
    const uniqueDates = Array.from(new Set(data.map(d => d.timestamp))); 
    const tickStep = Math.max(1, Math.floor(uniqueDates.length / numTicks));
    
    let spacedTicks = uniqueDates.filter((_, index) => index % tickStep === 0);
  
    if (!spacedTicks.includes(uniqueDates[0])) spacedTicks.unshift(uniqueDates[0]);
    if (!spacedTicks.includes(uniqueDates[uniqueDates.length - 1])) spacedTicks.push(uniqueDates[uniqueDates.length - 1]);
  
    return spacedTicks;
  };
  
  const handleChartClick = (event) => {
    if (event && event.activeLabel) {
      const clickedDate = event.activeLabel;
      const clickedData = stockData.find((d) => d.timestamp === clickedDate);

      if (clickedData) {
        setSelectedDate(clickedData);
      }
    }
  }; 

  return (
    <div className="flex flex-col w-screen min-h-screen items-center p-0 m-0">

      <div className="w-full flex flex-col items-center mt-4">

        <div className="w-full max-w-3xl">
          <SearchBarCopy />
        </div>

        <div className="w-76/100 flex justify-end mt-4">
          <BoxSelector onSelect={setSelectedOption} initialSelected={selectedOption} />
        </div>
        <div className="self-start w-full text-left ml-65">
          <p><strong>symbol:</strong> {selectedDate ? selectedDate.symbol : "N/A"}</p>
        </div>
      </div>
      

      <div className="w-4/5 mx-auto">
        <LineChart
          width={chartWidth}
          height={chartHeight}
          data={stockData}
          margin={{ top: 10, right: 50, left: 20, bottom: 50 }}
          onClick={handleChartClick}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis} 
            ticks={getSpacedTicks(stockData, 15)}
            interval="preserveStartEnd" 
            angle={-45}
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
          <Line type="bump" dataKey="close" stroke="#8884d8" dot={false} />
        </LineChart>
      </div>
      <DataBoxes selectedOption={selectedOption} date={selectedDate} data={stockData}></DataBoxes>
    </div>
  );
}

export default ChartArea;
