import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './createorder.css';

const CreateOrder = () => {
    const [token, setToken] = useState("");
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

    const getToken = () => {
        var refreshData = {
            "refresh_token": process.env.REACT_APP_REFRESH_TOKEN
        };

        axios.post("https://staging-api.tryoto.com/rest/v2/refreshToken", refreshData)
            .then(response => {
                console.log(response.data); // Log the entire response data
                setToken(response.data.access_token); // Save the token in state
            })
            .catch(error => console.log('error', error));
    };

    useEffect(() => {
        // Uncomment the below line to get the token on component mount
        // getToken();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://staging-api.tryoto.com/rest/v2/createOrder', orderData, {
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
            <button type="button" onClick={getToken} className="rbutton">Get Token</button>
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
