import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShippingData from './ShippingData';
import CreateOrder from './createorder';
import GetOrders from './GetOrders';
import PurchaseCredits from './PurchaseCredits';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/" element={<ShippingData />} />
          <Route path="/get-orders"  element={<GetOrders />} />
          <Route path="/purchase-credits" element={<PurchaseCredits />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;