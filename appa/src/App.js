import React from 'react';
import ShippingData from './ShippingData';
import CreateOrder from './createorder'; // Import the CreateOrder component

function App() {
  return (
    <div className="App">
      <ShippingData />
      <CreateOrder />
    </div>
  );
}

export default App;