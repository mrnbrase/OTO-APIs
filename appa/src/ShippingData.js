import React, { useState } from 'react';
import axios from 'axios';
import './ShippingData.css';

const App = () => {
    const [token, setToken] = useState(null);
    const [formData, setFormData] = useState({
        weight: '3',
        originCity: 'Riyadh',
        destinationCity: 'Jeddah',
        height: '1',
        width: '1',
        length: '1'
    });
    const [response, setResponse] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const getToken = () => {
        var refreshData = {
            "refresh_token": "AMf-vBxyYfrcy9ZMzic7ZsYn1rYPKTh2h5cMq4Zn8o2XDjfcGrp-oNQNg-Cza7dHNk0yPMjNTDnWlE_xtQdojVdOzgNO5CarK6uB5TLECWBEj0FRKYCmcn-cFd5g_jcR6zLsz2v0pXlaSuNFv6MBjBuCkHvZ49hTmsdNZvOdiDzQJWbTJd4SoarLrJC_KqiJqBDpDE-uZTyChELAtJvj5qn4sKxbek00hA"
        };

        axios.post("https://api.tryoto.com/rest/v2/refreshToken", refreshData, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            console.log(response.data); // Log the entire response data
            setToken(response.data.access_token); // Save the token in state
        })
        .catch(error => console.log('error', error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!token) {
            console.log('No token available');
            return;
        }

        var config = {
            method: 'post',
            url: 'https://api.tryoto.com/rest/v2/checkOTODeliveryFee',
            headers: { 
                'Authorization': `Bearer ${token}`
            },
            data : formData
        };

        axios(config)
        .then(function (response) {
            setResponse(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    };

    const handleClear = () => {
        setResponse(null);
    };

   // const keys = ['logo', 'serviceType', 'deliveryOptionName', 'trackingType', 'codCharge', 'pickupCutOffTime', 'maxOrderValue', 'insurancePolicy', 'maxCODValue', 'deliveryOptionId', 'extraWeightPerKg', 'deliveryCompanyName', 'returnFee', 'maxFreeWeight', 'avgDeliveryTime', 'price', 'pickupDropoff'];
    const keys = ['logo','deliveryOptionName', 'pickupDropoff', 'serviceType', 'codCharge', 'pickupCutOffTime', 'maxCODValue', 'returnFee', 'avgDeliveryTime', 'price'];

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="form">
                <input type="text" name="originCity" value={formData.originCity} onChange={handleChange} placeholder="Origin City" className="input" />
                <input type="text" name="destinationCity" value={formData.destinationCity} onChange={handleChange} placeholder="Destination City" className="input" />
                <input type="text" name="height" value={formData.height} onChange={handleChange} placeholder="Height" className="input" />
                <input type="text" name="width" value={formData.width} onChange={handleChange} placeholder="Width" className="input" />
                <input type="text" name="length" value={formData.length} onChange={handleChange} placeholder="Length" className="input" />
                <input type="text" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight" className="input" />
                <button onClick={getToken} className="button">Get Token</button>
                <button type="button" onClick={handleClear} className="button">Clear</button>
                <button type="submit" className="button">Search</button>
            </form>
            {response && 
            <table className="table">
                <thead>
                    <tr>
                        {keys.map((key, index) => (
                            <th key={index} className="table-header">{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {response.deliveryCompany.map((item, idx) => (
                        <tr key={idx}>
                            {keys.map((key, i) => (
                                <td key={i} className="table-data">
                                    {key === 'logo' ? 
                                        <img src={item[key]} alt="logo" style={{width: '50px', height: '50px'}} /> 
                                        : 
                                        item[key]
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        }
        </div>
    );
};

export default App;