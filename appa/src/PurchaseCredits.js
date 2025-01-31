import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './PurchaseCredits.css'; // Ensure to create this CSS file for styling

const baseUrl = process.env.NODE_ENV === 'production' 
? process.env.REACT_APP_API_BASE_URL_PRODUCTION 
: process.env.REACT_APP_API_BASE_URL_TESTING;



const PurchaseCredits = () => {
    const [token, setToken] = useState(null);
    const [tokenExpiry, setTokenExpiry] = useState(null);
    const [creditAmount, setCreditAmount] = useState('');
    const [paymentURL, setPaymentURL] = useState('');

    // Load the token and its expiry time from localStorage when the component mounts
    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        const savedTokenExpiry = localStorage.getItem('tokenExpiry');
        if (savedToken && savedTokenExpiry && new Date(savedTokenExpiry) > new Date()) {
            setToken(savedToken);
            setTokenExpiry(savedTokenExpiry);
        } else {
            getToken();
        }
    }, []);

    const getToken = () => {
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
    };

    const checkTokenExpiry = () => {
        if (!token || !tokenExpiry || new Date(tokenExpiry) <= new Date()) {
            getToken();
        }
    };

    const handleBuyShippingCredit = () => {
        checkTokenExpiry();
        if (!token) {
            console.log('No token available');
            return;
        }

        const config = {
            method: 'post',
            url: `${baseUrl}/buyShippingCredit`,
            headers: { 
                'Authorization': `Bearer ${token}`
            },
            data: {
                amount: parseFloat(creditAmount)
            }
        };

        axios(config)
        .then(response => {
            setPaymentURL(response.data.paymentURL);
            console.log('Payment URL:', response.data.paymentURL);
        })
        .catch(error => console.log('Error purchasing shipping credit:', error));
    };

    const handleBuyOTOCredit = () => {
        checkTokenExpiry();
        if (!token) {
            console.log('No token available');
            return;
        }

        const config = {
            method: 'post',
            url: `${baseUrl}/buyOTOCredit`,
            headers: { 
                'Authorization': `Bearer ${token}`
            },
            data: {
                amount: parseFloat(creditAmount)
            }
        };

        axios(config)
        .then(response => {
            setPaymentURL(response.data.paymentURL);
            console.log('Payment URL:', response.data.paymentURL);
        })
        .catch(error => console.log('Error purchasing OTO credit:', error));
    };

    return (
        <div className="container">
            <div className="heading">Purchase Credits</div>
            <Link to="/">
                <button className="rbutton">Back</button>
            </Link>
            <button className="rbutton" onClick={getToken}>Refresh Token</button>

            <div className="form">
                <label className="label">
                    Credit Amount:
                    <input 
                        type="number" 
                        value={creditAmount} 
                        onChange={(e) => setCreditAmount(e.target.value)} 
                        className="input"
                        placeholder="Enter amount"
                    />
                </label>

                <button type="button" onClick={handleBuyShippingCredit} className="button">
                    Buy Shipping Credit
                </button>
                <button type="button" onClick={handleBuyOTOCredit} className="button">
                    Buy OTO Credit
                </button>

                {paymentURL && (
                    <div className="payment-link">
                        <a href={paymentURL} target="_blank" rel="noopener noreferrer">Proceed to Payment</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchaseCredits;
