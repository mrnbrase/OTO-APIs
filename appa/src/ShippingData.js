import React, { useState } from 'react';
import axios from 'axios';

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

    const keys = ['serviceType', 'deliveryOptionName', 'trackingType', 'codCharge', 'pickupCutOffTime', 'maxOrderValue', 'insurancePolicy', 'maxCODValue', 'deliveryOptionId', 'extraWeightPerKg', 'deliveryCompanyName', 'returnFee', 'maxFreeWeight', 'avgDeliveryTime', 'price', 'logo', 'pickupDropoff'];

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight" />
                <input type="text" name="originCity" value={formData.originCity} onChange={handleChange} placeholder="Origin City" />
                <input type="text" name="destinationCity" value={formData.destinationCity} onChange={handleChange} placeholder="Destination City" />
                <input type="text" name="height" value={formData.height} onChange={handleChange} placeholder="Height" />
                <input type="text" name="width" value={formData.width} onChange={handleChange} placeholder="Width" />
                <input type="text" name="length" value={formData.length} onChange={handleChange} placeholder="Length" />
                <button onClick={getToken}>Get Token</button>
                <button type="submit">Submit</button>
            </form>
            {response && 
                <table style={{border: '1px solid black', borderCollapse: 'collapse', width: '100%'}}>
                    <thead>
                        <tr>
                            {keys.map((key, index) => (
                                <th key={index} style={{border: '1px solid black', padding: '10px', backgroundColor: '#f2f2f2'}}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {response.deliveryCompany.map((item, idx) => (
                            <tr key={idx}>
                                {keys.map((key, i) => (
                                    <td key={i} style={{border: '1px solid black', padding: '10px'}}>{item[key]}</td>
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