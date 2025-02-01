import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import BoxSelector from "./BoxSelector";
import SearchBarCopy from "./SearchBarCopy";

function ChartArea() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedOption, setSelectedOption] = useState(() => {
    return localStorage.getItem("selectedOption") || "Today";
  });

  useEffect(() => {
    localStorage.setItem("selectedOption", selectedOption);
  }, [selectedOption]);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://127.0.0.1:5000/stocks/${symbol}?interval=${selectedOption}`);
        if (!response.ok) {
          throw new Error("Stock data not found");
        }
        const data = await response.json();

        const formattedData = data.dates.map((date, index) => ({
          date,
          price: data.close_prices[index],
        }));

        setStockData(formattedData);
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

  const formatPrice = (value) => `$${value.toFixed(4)}`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black p-2 rounded shadow-md">
          <p className="font-bold">{`Date: ${label}`}</p>
          <p>{`Price: ${formatPrice(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col w-screen min-h-screen items-center p-0 m-0">
      {/* Top Section: Contains SearchBar + Selection Boxes */}
      <div className="w-full flex flex-col items-center mt-4">
        {/* Larger Search Bar Centered */}
        <div className="w-2/3 max-w-2xl">
          <SearchBarCopy />
        </div>

        {/* Selection Boxes Aligned to the Right */}
        <div className="w-4/5 flex justify-end mt-4">
          <BoxSelector onSelect={setSelectedOption} initialSelected={selectedOption} />
        </div>
      </div>

      {/* Chart Centered */}
      <div className="mt-6 flex justify-center w-full">
        <LineChart
          width={1600}
          height={600}
          data={stockData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[adjustedMin, adjustedMax]} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
        </LineChart>
      </div>
    </div>
  );
}

export default ChartArea;
