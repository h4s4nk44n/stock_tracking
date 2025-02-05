import React from "react";
import "../css/main.css";

function DataBoxes({ date, selectedOption, data }) {
  if (!date || Object.keys(date).length === 0) {
    return <p>Select a date from the graph</p>;
  }
  let formattedTime = String(date.timestamp);
  
      if (formattedTime.includes(" ")) {
        const [datePart, timePart] = formattedTime.split(" ");
  
        if (["1d", "7d", "30d"].includes(selectedOption)) {
          formattedTime = `${datePart} ${timePart}`;
        } else {
          formattedTime = datePart;
        }
      }
  const lowestPrice = Math.min(...data.map(d => d.close));
  const highestPrice = Math.max(...data.map(d => d.close));
  const openPrice = data[0].open;
  return (
    <div className="data-boxes">
      <h3>Selected Date: {formattedTime}</h3>
      <p><strong>Price:</strong> ${date.close?.toFixed(4)}</p>
      {selectedOption === "1d" && (
        <p><strong>Open Price:</strong> ${openPrice.toFixed(4)}</p>
      )}
      <p><strong>highest Price:</strong> ${highestPrice.toFixed(4)}</p>
      <p><strong>lowest Price:</strong> ${lowestPrice.toFixed(4)}</p>
      <p><strong>volume:</strong> {date.volume}</p>
    </div>
  );
}

export default DataBoxes;

