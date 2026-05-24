const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const routes = require('./routes/index.js');
const config = require('./config/index.js');

const app = express();

// .env configuration 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: config.cors.origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
}));
app.get('/api/health', (req, res) => res.status(200).send('ok'));
app.use('/api/', routes);

app.listen(config.server.port, ()=> {
    console.log(`Server running in port ${config.server.port}`);
});
