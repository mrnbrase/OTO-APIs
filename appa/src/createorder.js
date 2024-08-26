import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './createorder.css';

const CreateOrder = () => {
    const [token, setToken] = useState("");
    const [orderData, setOrderData] = useState({
        "orderId": "1234",    
        "pickupLocationCode": "jdd_wh",
        "createShipment": "true",
        "deliveryOptionId": 564,
        "payment_method": "paid",
        "amount": 100,
        "amount_due": 0,
        "currency": "SAR",
        "customsValue":"12",
        "customsCurrency":"USD",
        "packageCount": 2,
        "packageWeight": 1,
        "boxWidth": 10,
        "boxLength": 10,
        "boxHeight": 10,
        "orderDate": "31/12/2022 15:45",
        "deliverySlotDate": "31/12/2020",
        "deliverySlotTo": "12pm",
        "deliverySlotFrom": "2:30pm",
        "senderName":"Sender Company",
        "customer": {
            "name": "عبدالله الغامدي",
            "email": "test@test.com",
            "mobile": "546607389",
            "address": "6832, Abruq AR Rughamah District, Jeddah 22272 3330, Saudi Arabia",
            "district": "Al Hamra",
            "city": "Jeddah",
            "country": "SA",
            "postcode": "12345",
            "lat": "40.706333",
            "lon": "29.888211",
            "refID":"1000012",
            "W3WAddress":"alarmed.cards.stuffy"
        },
        "items": [
            {
                "productId": 112,
                "name": "test product",
                "price": 100,
                "rowTotal": 100,
                "taxAmount": 15,
                "quantity": 1,
                "sku": "test-product",
                "image": "http://...."
            },
            {
                "name": "test product 2",
                "price": 100,
                "quantity": 1,
                "sku": "test-product-2"
            }
        ]
    });


    const getToken = () => {
        var refresh = {
            "refresh_token": "AMf-vBwoi4oY-ejRJkhOzIgAX6SBV3_2r7vTQfYecM8FuxgKQxNhMOjo66B7BItZXMqKcuNNHxufqeCTCTd2OTwttOEwqcSGq26UkdmyF74_6ZQkYEPdQDKX3-3DnKPh1OZqx9pViOy6hIBSKkT-8wReBybaGChW9JwTaEwjK1vX9T6reiadCwBm6j6QHDAYkBFZ41_9EWf2VWbsa5P2eAXLBQfCowBBqQ"
        };

        axios.post("https://staging-api.tryoto.com/rest/v2/refreshToken", refresh, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            setToken(response.data.access_token);
        })
        .catch(error => console.log('error', error));
    };

    useEffect(() => {
        getToken();
    }, []);

    const createOrder = () => {
        const data = JSON.stringify(orderData);
        console.log('orderData:', orderData); // log orderData
    
        console.log('access_token:', token); // log token
    
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://staging-api.tryoto.com/rest/v2/createOrder',
            headers: { 
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data : data
        };
    
        axios(config)
        .then(response => {
            console.log(JSON.stringify(response.data));
        })
        .catch(error => {
            console.log(error);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createOrder();
    };

    return (
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
    
            <h2>Item Details</h2>
            <label className="label">
                <span>Item Name</span>
                <input type="text" className="input" placeholder="Item Name" onChange={e => setOrderData({...orderData, items: [{...orderData.items[0], name: e.target.value}]})} required />
            </label>
            <label className="label">
                <span>Item Price</span>
                <input type="text" className="input" placeholder="Item Price" onChange={e => setOrderData({...orderData, items: [{...orderData.items[0], price: e.target.value}]})} required />
            </label>
            <label className="label">
                <span>Item Quantity</span>
                <input type="text" className="input" placeholder="Item Quantity" onChange={e => setOrderData({...orderData, items: [{...orderData.items[0], quantity: e.target.value}]})} required />
            </label>
            <label className="label">
                <span>Item SKU</span>
                <input type="text" className="input" placeholder="Item SKU" onChange={e => setOrderData({...orderData, items: [{...orderData.items[0], sku: e.target.value}]})} required />
            </label>
            <button type="submit" className="button">Create Order</button>
        </form>
    );
};

export default CreateOrder;