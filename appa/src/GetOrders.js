import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import getAllOrders from './GetAllOrders'; // Import the function

const App = () => {
    const [token, setToken] = useState(null);
    const [orders, setOrders] = useState(null);
    const [perPage, setPerPage] = useState(3); // Default values can be set here
    const [page, setPage] = useState(1);
    const [minDate, setMinDate] = useState('2022-01-01');
    const [maxDate, setMaxDate] = useState('2024-06-10');

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
            setOrders(response); // Set the response to orders state
            console.log('Orders fetched:', response);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <div>
            <Link to="/">
                <button className="rbutton">Back</button>
            </Link>
            <button type="button" onClick={getToken} className="rbutton">Get Token</button>
            <button onClick={searchOrders} className="rbutton">Search Orders</button>
            {orders && <div>{JSON.stringify(orders)}</div>}
        </div>
    );
};

export default App;
