import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShippingData from './ShippingData';
import CreateOrder from './createorder';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/" element={<ShippingData />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;