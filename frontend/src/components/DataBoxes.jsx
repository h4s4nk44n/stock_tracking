import React from "react";
import "../css/main.css";

function DataBoxes({ date, selectedOption, data }) {
  if (!date) {
    return <p>Select a date from the graph</p>; // ✅ Better message
  }
  let formattedTime = String(date.date); // ✅ Ensure `label` is a string
  
      if (formattedTime.includes(" ")) {
        const [datePart, timePart] = formattedTime.split(" "); // ✅ Extract Date & Time
  
        if (["1d", "1w", "1m"].includes(selectedOption)) {
          formattedTime = `${datePart} ${timePart}`; // ✅ Show only HH:mm for "Today"
        } else {
          formattedTime = datePart;
        }
      }
  const lowestPrice = Math.min(...data.map(d => d.price)); // ✅ Fixing the path
  const highestPrice = Math.max(...data.map(d => d.price)); // ✅ Fixing the path
  const openPrice = data[0].price;
  return (
    <div className="data-boxes">
      <h3>Selected Date: {formattedTime}</h3>
      <p><strong>Price:</strong> ${date.price.toFixed(4)}</p>
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

