import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import getAllOrders from './GetAllOrders';
import './GetOrders.css'; // Import the CSS file

const App = () => {
    const [token, setToken] = useState(null);
    const [orders, setOrders] = useState(null);
    const [perPage, setPerPage] = useState(3); // Default values can be set here
    const [page, setPage] = useState(1);
    const [minDate, setMinDate] = useState('2022-01-01');
    const [maxDate, setMaxDate] = useState('2025-01-01');

    const getToken = () => {
        var refreshData = {
            "refresh_token": process.env.REACT_APP_REFRESH_TOKEN
        };

        axios.post("https://staging-api.tryoto.com/rest/v2/refreshToken", refreshData)
            .then(response => {
                console.log('Token received:', response.data.access_token);
                setToken(response.data.access_token); // Save the token in state
            })
            .catch(error => console.log('Error fetching token:', error));
    };

    const searchOrders = async () => {
        if (!token) {
            console.log('No token available');
            return;
        }

        try {
            const response = await getAllOrders(perPage, page, minDate, maxDate, token);
            setOrders(response.orders); // Set the response to orders state
            console.log('Orders fetched:', response);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    const handleClear = () => {
        setOrders(null); // Clear the orders list
    };

    return (
        <div className="container">
            <div className="heading">Order Management</div>
            <Link to="/">
                <button className="rbutton">Back</button>
            </Link>
            <Link to="/create-order">
                    <button className="rbutton">Create Order</button>
                </Link>
            <button type="button" onClick={getToken} className="rbutton">Get Token</button>

            <div>
                <label>
                    Min Date:
                    <div className="input-group">
                        <input 
                            type="date" 
                            value={minDate} 
                            onChange={(e) => setMinDate(e.target.value)} 
                        />
                    </div>
                </label>
            </div>
            <div>
                <label>
                    Max Date:
                    <div className="input-group">
                        <input 
                            type="date" 
                            value={maxDate} 
                            onChange={(e) => setMaxDate(e.target.value)} 
                        />
                    </div>
                </label>
            </div>
            <button type="button" onClick={handleClear} className="rbutton">Clear</button>
            <button onClick={searchOrders} className="rbutton">Search Orders</button>

            {orders && (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="table-header">Order ID</th>
                                <th className="table-header">Customer Name</th>
                                <th className="table-header">Customer Phone</th>
                                <th className="table-header">Customer Address</th>
                                <th className="table-header">Origin City</th>
                                <th className="table-header">Destination City</th>
                                <th className="table-header">Grand Total (SAR)</th>
                                <th className="table-header">Payment Method</th>
                                <th className="table-header">Order Date</th>
                                <th className="table-header">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={index}>
                                    <td className="table-data">{order.orderID}</td>
                                    <td className="table-data">{order.customerName}</td>
                                    <td className="table-data">{order.customerPhone}</td>
                                    <td className="table-data">{order.customerAddress}</td>
                                    <td className="table-data">{order.originCity}</td>
                                    <td className="table-data">{order.destinationCity}</td>
                                    <td className="table-data">{order.grandTotal}</td>
                                    <td className="table-data">{order.paymentMethod}</td>
                                    <td className="table-data">{new Date(order.orderDate).toLocaleString()}</td>
                                    <td className="table-data">{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default App;
