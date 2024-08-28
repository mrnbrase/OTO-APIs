import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ShippingData.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

const App = () => {
    const [token, setToken] = useState(null);
    const [tokenExpiry, setTokenExpiry] = useState(null);
    const [formData, setFormData] = useState({
        weight: '3',
        originCity: '',
        destinationCity: '',
        height: '1',
        width: '1',
        length: '1'
    });
    const [response, setResponse] = useState(null);
    const [filteredOriginCities, setFilteredOriginCities] = useState([]);
    const [filteredDestinationCities, setFilteredDestinationCities] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_BASE_URL_PRODUCTION 
    : process.env.REACT_APP_API_BASE_URL_TESTING;

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

        axios.post(`${baseUrl}/refreshToken`, refreshData)  // Use the baseUrl here
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'originCity') {
            const filtered = cities.filter(city => city.toLowerCase().includes(value.toLowerCase()));
            setFilteredOriginCities(filtered);
            setShowDropdown(true);
        } else if (name === 'destinationCity') {
            const filtered = cities.filter(city => city.toLowerCase().includes(value.toLowerCase()));
            setFilteredDestinationCities(filtered);
            setShowDropdown(true);
        }
    };

    const handleCitySelect = (city, field) => {
        setFormData({
            ...formData,
            [field]: city
        });
        if (field === 'originCity') {
            setFilteredOriginCities([]);
        } else if (field === 'destinationCity') {
            setFilteredDestinationCities([]);
        }
        setShowDropdown(false);
    };

    const increment = (field) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: (parseFloat(prevFormData[field]) + 1).toString()
        }));
    };

    const decrement = (field) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: Math.max(0, parseFloat(prevFormData[field]) - 1).toString() // Ensure it doesn't go below 0
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        checkTokenExpiry();
    
        if (!token) {
            console.log('No token available');
            return;
        }
    
        const config = {
            method: 'post',
            url: `${baseUrl}/checkOTODeliveryFee`,  // Use the baseUrl here
            headers: { 
                'Authorization': `Bearer ${token}`
            },
            data: formData
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

    const keys = ['logo','deliveryOptionId', 'deliveryOptionName', 'pickupDropoff', 'serviceType', 'codCharge', 'pickupCutOffTime', 'maxCODValue', 'maxFreeWeight', 'extraWeightPerKg', 'returnFee', 'avgDeliveryTime', 'price'];

    const cities = [
        'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Tabuk', 'Taif', 'Buraidah', 
        'Khobar', 'Abha', 'Najran', 'Jubail', 'Hail', 'Khamis Mushait', 'Al Khafji', 
        'Al Majmaah', 'Al Mubarraz', 'Al Bahah', 'Arar', 'Jizan', 'Yanbu', 'Qatif', 
        'Al Qunfudhah', 'Hafar Al-Batin', 'Al Ahsa', 'Al Zulfi', 'Ras Tanura', 
        'Al Kharj', 'Al Bukayriyah', 'Al Qurayyat', 'Afif', 'Al Lith', 'Al Dawadmi', 
        'Rafha', 'Duba', 'Sharurah', 'Turaif', 'Al Ula', 'Abqaiq', 'Sakaka', 'Ad Dilam', 
        'Bisha', 'Unaizah', 'Khafji', 'Al Wajh', 'Baljurashi', 'Al Mithnab', 
        'As Sulayyil', 'Al Hanakiyah', 'Al Namas', 'Al Quwayiyah', 'Al Dair', 
        'Al Mahd', 'Al Shinan', 'Al Hariq', 'Al Muwayh'
    ];

    return (
        <div className="container">
                <Link to="/purchase-credits">
                    <button className="rbutton">Purchase Credits</button>
                </Link>
                <Link to="/create-order">
                    <button className="rbutton">Create Order</button>
                </Link>
                <Link to="/get-orders">
                    <button className="rbutton">Get Orders</button>
                </Link>
            <form onSubmit={handleSubmit} className="form">
            <label>
            Origin City
            <div className="input-group">
                <input 
                    type="text" 
                    name="originCity" 
                    value={formData.originCity} 
                    onChange={handleChange} 
                    placeholder="Origin City" 
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 100)} // Delay closing to allow click
                />
            </div>
            {showDropdown && filteredOriginCities.length > 0 && (
                <div className="dropdown">
                    {filteredOriginCities.map((city, index) => (
                        <div 
                            key={index} 
                            className="dropdown-item" 
                            onClick={() => handleCitySelect(city, 'originCity')}
                        >
                            <FaMapMarkerAlt className="dropdown-icon" /> {city}
                        </div>
                    ))}
                </div>
            )}
        </label>
        <label>
            Destination City
            <div className="input-group">
                <input 
                    type="text" 
                    name="destinationCity" 
                    value={formData.destinationCity} 
                    onChange={handleChange} 
                    placeholder="Destination City" 
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 100)} // Delay closing to allow click
                />
            </div>
            {showDropdown && filteredDestinationCities.length > 0 && (
                <div className="dropdown">
                    {filteredDestinationCities.map((city, index) => (
                        <div 
                            key={index} 
                            className="dropdown-item" 
                            onClick={() => handleCitySelect(city, 'destinationCity')}
                        >
                            <FaMapMarkerAlt className="dropdown-icon" /> {city}
                        </div>
                    ))}
                </div>
            )}
        </label>
                
                <label>
                    Length
                    <div className="input-group">
                        <button type="button" onClick={() => decrement('length')}>-</button>
                        <input type="text" name="length" value={formData.length} onChange={handleChange} />
                        <span>cm</span>
                        <button type="button" onClick={() => increment('length')}>+</button>
                    </div>
                </label>
                <label>
                    Width
                    <div className="input-group">
                        <button type="button" onClick={() => decrement('width')}>-</button>
                        <input type="text" name="width" value={formData.width} onChange={handleChange} />
                        <span>cm</span>
                        <button type="button" onClick={() => increment('width')}>+</button>
                    </div>
                </label>
                <label>
                    Height
                    <div className="input-group">
                        <button type="button" onClick={() => decrement('height')}>-</button>
                        <input type="text" name="height" value={formData.height} onChange={handleChange} />
                        <span>cm</span>
                        <button type="button" onClick={() => increment('height')}>+</button>
                    </div>
                </label>
                <label>
                    Weight
                    <div className="input-group">
                        <button type="button" onClick={() => decrement('weight')}>-</button>
                        <input type="text" name="weight" value={formData.weight} onChange={handleChange} />
                        <span>kg</span>
                        <button type="button" onClick={() => increment('weight')}>+</button>
                    </div>
                </label>
                
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
