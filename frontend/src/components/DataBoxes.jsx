import React from "react";
import "../css/main.css";

function DataBoxes({ date }) {
  if (!date) {
    return <p>Select Some Date bitch</p>; // Show a message if no date is selected
  }

  return (
    <div className="data-boxes">
      <h3>Selected Date: {date.date}</h3>
      <p><strong>Price:</strong> ${date.price}</p>
    </div>
  );
}

export default DataBoxes;
