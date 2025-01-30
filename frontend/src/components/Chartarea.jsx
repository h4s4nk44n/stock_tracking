import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

function ChartArea({ data, onDateSelect }) {
  const handleChartClick = (event) => {
    if (event && event.activeLabel) {
      const clickedDate = event.activeLabel;
      const clickedData = data.find((d) => d.date === clickedDate); // Find the clicked date data
      onDateSelect(clickedData || null); // Send data to the parent
    }
  };

  return (
    <LineChart
      width={1600}
      height={600}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      onClick={handleChartClick} // Add the click handler
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip 
        wrapperStyle={{
          width: "7em",
          height: "2em"
        }}
        />
      <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false}/>
    </LineChart>
  );
}

export default ChartArea;
