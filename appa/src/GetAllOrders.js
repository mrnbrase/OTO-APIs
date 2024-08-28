import axios from 'axios';

const getAllOrders = async (perPage, page, minDate, maxDate, token) => {
    const config = {
        method: 'get',
        url: `https://staging-api.tryoto.com/rest/v2/getAllOrders?perPage=${perPage}&page=${page}&minDate=${minDate}&maxDate=${maxDate}`,
        headers: { 
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error('Error in API request:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export default getAllOrders;
