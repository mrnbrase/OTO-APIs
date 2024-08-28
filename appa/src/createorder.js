import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './createorder.css';

const CreateOrder = () => {
    const [token, setToken] = useState("");
    const [tokenExpiry, setTokenExpiry] = useState(null); // To store the expiration time
    const [orderData, setOrderData] = useState({
        orderId: '',
        payment_method: '',
        amount: 0,
        amount_due: 0,
        currency: '',
        customer: {
            name: '',
            mobile: '',
            address: '',
            city: '',
            country: ''
        },
        items: [{
            name: '',
            price: 0,
            quantity: 0,
            sku: ''
        }]
    });

    
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
    }, [getToken]); // Now you can safely include getToken
    
    

    const checkTokenExpiry = () => {
        if (!token || !tokenExpiry || new Date(tokenExpiry) <= new Date()) {
            getToken();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        checkTokenExpiry();
        try {
            const response = await axios.post(`${baseUrl}/createOrder`, orderData, {
                headers: { 
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                maxBodyLength: Infinity
            });
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container">
            <Link to="/">
                <button className="rbutton">Back</button>
            </Link>
            <Link to="/purchase-credits">
                    <button className="rbutton">Purchase Credits</button>
            </Link>
            <Link to="/get-orders">
                    <button className="rbutton">Get Orders</button>
            </Link>
            <form onSubmit={handleSubmit} className="form">
                <label className="label">
                    <span>Order ID</span>
                    <input type="text" className="input" placeholder="Order ID" onChange={e => setOrderData({...orderData, orderId: e.target.value})} required />
                </label>
                <label className="label">
                    <span>Payment Method</span>
                    <select className="input" onChange={e => setOrderData({...orderData, payment_method: e.target.value})} required>
                        <option value="">Select Payment Method</option>
                        <option value="cod">COD</option>
                        <option value="paid">Paid</option>
                    </select>
                </label>
                <label className="label">
                    <span>Amount</span>
                    <input type="number" className="input" placeholder="Amount" onChange={e => setOrderData({...orderData, amount: parseFloat(e.target.value)})} required />
                </label>
                <label className="label">
                    <span>Amount Due</span>
                    <input type="number" className="input" placeholder="Amount Due" onChange={e => setOrderData({...orderData, amount_due: parseFloat(e.target.value)})} required />
                </label>
                <label className="label">
                    <span>Currency</span>
                    <input type="text" className="input" placeholder="Currency" onChange={e => setOrderData({...orderData, currency: e.target.value})} required />
                </label>

                <h2>Customer Details</h2>
                <label className="label">
                    <span>Customer Name</span>
                    <input type="text" className="input" placeholder="Customer Name" onChange={e => setOrderData({...orderData, customer: {...orderData.customer, name: e.target.value}})} required />
                </label>
                <label className="label">
                    <span>Customer Mobile</span>
                    <input type="text" className="input" placeholder="Customer Mobile" onChange={e => setOrderData({...orderData, customer: {...orderData.customer, mobile: e.target.value}})} required />
                </label>
                <label className="label">
                    <span>Customer Address</span>
                    <input type="text" className="input" placeholder="Customer Address" onChange={e => setOrderData({...orderData, customer: {...orderData.customer, address: e.target.value}})} required />
                </label>
                <label className="label">
                    <span>Customer City</span>
                    <input type="text" className="input" placeholder="Customer City" onChange={e => setOrderData({...orderData, customer: {...orderData.customer, city: e.target.value}})} required />
                </label>
                <label className="label">
                    <span>Customer Country</span>
                    <input type="text" className="input" placeholder="Customer Country" onChange={e => setOrderData({...orderData, customer: {...orderData.customer, country: e.target.value}})} required />
                </label>

                <h2>Item Details</h2>
                <label className="label">
                    <span>Item Name</span>
                    <input type="text" className="input" placeholder="Item Name" onChange={e => setOrderData({...orderData, items: [{...orderData.items[0], name: e.target.value}]})} required />
                </label>
                <label className="label">
                    <span>Item Price</span>
                    <input type="number" className="input" placeholder="Item Price" onChange={e => setOrderData({...orderData, items: [{...orderData.items[0], price: parseFloat(e.target.value)}]})} required />
                </label>
                <label className="label">
                    <span>Item Quantity</span>
                    <input type="number" className="input" placeholder="Item Quantity" onChange={e => setOrderData({...orderData, items: [{...orderData.items[0], quantity: parseFloat(e.target.value)}]})} required />
                </label>
                <label className="label">
                    <span>Item SKU</span>
                    <input type="text" className="input" placeholder="Item SKU" onChange={e => setOrderData({...orderData, items: [{...orderData.items[0], sku: e.target.value}]})} required />
                </label>

                <button type="submit" className="button">Create Order</button>
            </form>
        </div>
    );
};

export default CreateOrder;
