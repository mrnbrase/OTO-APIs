// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Add this line

app.post('/refreshToken', (req, res) => {
    axios.post('https://api.tryoto.com/rest/v2/refreshToken', req.body)
        .then(response => res.send(response.data))
        .catch(error => res.status(500).send({ message: error.message }));
});

app.post('/checkOTODeliveryFee', (req, res) => {
    console.log('Request body:', req.body);
    console.log('Authorization header:', req.headers.authorization);

    axios.post('https://api.tryoto.com/rest/v2/checkOTODeliveryFee', req.body, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + req.headers.authorization
        }
    })
    .then(response => res.send(response.data))
    .catch(error => {
        console.log('Error:', error.message);
        if (error.response && error.response.status === 401) {
            res.status(401).send({ message: error.message });
        } else {
            res.status(500).send({ message: error.message });
        }
    });
});

app.listen(3001, () => console.log('Proxy server running on http://localhost:3001'));