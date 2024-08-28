import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Header.css'; // Import the CSS file for the header

const Header = () => {
    const [token, setToken] = useState(null);
    const [tokenExpiry, setTokenExpiry] = useState(null);
    const [clientInfo, setClientInfo] = useState({
        remainingShippingCredit: null,
        remainingOTOCredit: null,
    });

    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        const savedTokenExpiry = localStorage.getItem('tokenExpiry');
        if (savedToken && savedTokenExpiry && new Date(savedTokenExpiry) > new Date()) {
            setToken(savedToken);
            setTokenExpiry(savedTokenExpiry);
            getClientInfo(savedToken);
        } else {
            getToken();
        }
    }, []);

    const getToken = () => {
        const refreshData = {
            "refresh_token": process.env.REACT_APP_REFRESH_TOKEN
        };

        axios.post("https://staging-api.tryoto.com/rest/v2/refreshToken", refreshData)
            .then(response => {
                const newToken = response.data.access_token;
                const expiresIn = response.data.expires_in; // Get the expiration time in seconds
                const expiryTime = new Date(new Date().getTime() + expiresIn * 1000); // Calculate expiry time

                setToken(newToken);
                setTokenExpiry(expiryTime);

                localStorage.setItem('authToken', newToken);
                localStorage.setItem('tokenExpiry', expiryTime);

                getClientInfo(newToken);
            })
            .catch(error => console.log('Error fetching token:', error));
    };

    const getClientInfo = (currentToken) => {
        const config = {
            method: 'get',
            url: 'https://staging-api.tryoto.com/rest/v2/clientInfo',
            headers: { 
                'Authorization': `Bearer ${currentToken}`
            }
        };

        axios(config)
        .then(response => {
            setClientInfo({
                remainingShippingCredit: response.data.remainingShippingCredit,
                remainingOTOCredit: response.data.remainingOTOCredit,
            });
            console.log('Client Info:', response.data);
        })
        .catch(error => console.log('Error fetching client info:', error));
    };

    return (
        <div className="header">
            <div className="credits-info">
                <span>Shipping Credit: {clientInfo.remainingShippingCredit !== null ? clientInfo.remainingShippingCredit : 'Loading...'}</span>
                <span> OTO Credit: {clientInfo.remainingOTOCredit !== null ? clientInfo.remainingOTOCredit : 'Loading...'}</span>
            </div>
        </div>
    );
};

export default Header;
