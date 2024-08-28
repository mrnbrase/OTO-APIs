import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import getAllOrders from './GetAllOrders';
import './GetOrders.css'; // Import the CSS file

const App = () => {
    const [token, setToken] = useState(null);
    const [tokenExpiry, setTokenExpiry] = useState(null);
    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0); // To store the total number of orders
    const [perPage, setPerPage] = useState(3); // Default value can be set here
    const [page, setPage] = useState(1);
    const [minDate, setMinDate] = useState('2022-01-01');
    const [maxDate, setMaxDate] = useState('2025-01-01');

    const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.REACT_APP_API_BASE_URL_PRODUCTION 
        : process.env.REACT_APP_API_BASE_URL_TESTING;

    const getToken = useCallback(() => {
        const refreshData = {
            "refresh_token": process.env.REACT_APP_REFRESH_TOKEN
        };

        axios.post(`${baseUrl}/refreshToken`, refreshData)
            .then(response => {
                const newToken = response.data.access_token;
                const expiresIn = response.data.expires_in; // Get the expiration time in seconds
                const expiryTime = new Date(new Date().getTime() + expiresIn * 1000); // Calculate expiry time

                setToken(newToken);
                setTokenExpiry(expiryTime);

                localStorage.setItem('authToken', newToken);
                localStorage.setItem('tokenExpiry', expiryTime);
            })
            .catch(error => console.log('Error fetching token:', error));
    }, [baseUrl]);

    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        const savedTokenExpiry = localStorage.getItem('tokenExpiry');
        if (savedToken && savedTokenExpiry && new Date(savedTokenExpiry) > new Date()) {
            setToken(savedToken);
            setTokenExpiry(savedTokenExpiry);
        } else {
            getToken();
        }
    }, [getToken]);

    const checkTokenExpiry = () => {
        if (!token || !tokenExpiry || new Date(tokenExpiry) <= new Date()) {
            getToken();
        }
    };

    const searchOrders = async () => {
        checkTokenExpiry();
        if (!token) {
            console.log('No token available');
            return;
        }
    
        console.log('Searching with perPage:', perPage, 'page:', page); // Debugging log
    
        try {
            const response = await getAllOrders(perPage, page, minDate, maxDate, token);
            setOrders(response.orders); // Set the response to orders state
            setTotalOrders(response.total || response.orders.length); // Assuming the total number of orders is returned in the response
            console.log('Orders fetched:', response);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleClear = () => {
        setOrders([]); // Clear the orders list
        setTotalOrders(0); // Reset total orders
    };

    const handlePerPageChange = (e) => {
        setPerPage(Number(e.target.value));
        setPage(1); // Reset to the first page
    };
    
    const handlePageChange = (direction) => {
        const newPage = page + direction;
        if (newPage > 0 && newPage <= Math.ceil(totalOrders / perPage)) {
            setPage(newPage);
        }
    };

    useEffect(() => {
        searchOrders();
    }, [page, perPage]);

    return (
        <div className="container">
            <div className="heading">Order Management</div>
            <Link to="/">
                <button className="rbutton">Back</button>
            </Link>
            <Link to="/purchase-credits">
                <button className="rbutton">Purchase Credits</button>
            </Link>
            <Link to="/create-order">
                <button className="rbutton">Create Order</button>
            </Link>

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

            <div className="pagination-controls">
                <label>
                    Items per page:
                    <select value={perPage} onChange={handlePerPageChange}>
                        <option value={5}>5</option>
                        <option value={7}>7</option>
                        <option value={10}>10</option>
                    </select>
                </label>
                <div className="page-controls">
                    <button onClick={() => handlePageChange(-1)} disabled={page === 1}>
                        Previous
                    </button>
                    <span>Page {page} of {Math.ceil(totalOrders / perPage)}</span>
                    <button onClick={() => handlePageChange(1)} disabled={page >= Math.ceil(totalOrders / perPage)}>
                        Next
                    </button>
                </div>
            </div>

            <button type="button" onClick={handleClear} className="rbutton">Clear</button>
            <button onClick={searchOrders} className="rbutton">Search Orders</button>

            {orders && orders.length > 0 && (
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
