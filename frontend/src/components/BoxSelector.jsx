import { useState, useEffect } from "react";

const BoxSelector = ({ onSelect, initialSelected }) => {
  const options = [
    { id: 1, label: "Today", value: "1d" },
    { id: 2, label: "Last Week", value: "7d" },
    { id: 3, label: "Last Month", value: "30d" },
    { id: 4, label: "Last Year", value: "1y" },
    { id: 5, label: "10 Year", value: "10y" },
  ];
  const [selected, setSelected] = useState(initialSelected);

  useEffect(() => {
    onSelect(initialSelected);
  }, [initialSelected, onSelect]);

  const handleSelect = (value) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className="flex space-x-4">
      {options.map((option) => (
        <div
          key={option.id}
          className={`cursor-pointer p-2 border- ${
            selected === option.value ? "border-blue-500 bg-blue-100 text-black"  : "border-gray-300"
          } rounded-lg text-center w-24`}
          onClick={() => handleSelect(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default BoxSelector;
