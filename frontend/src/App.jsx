import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StockProvider } from "./context/StockContext"; // ✅ Ensure correct path
import Header from "./components/Header";
import ChartArea from "./components/Chartarea";

function App() {
  return (
    <StockProvider> {/* ✅ Wrap entire app */}
      <Router>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/:symbol" element={<ChartArea />} />
        </Routes>
      </Router>
    </StockProvider>
  );
}

export default App;
