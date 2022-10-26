const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const itemsRoutes = require('./routes/items-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Orgin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATH, DELETE');
    next();
});

app.use('/api/items', itemsRoutes);
app.use('/api/users', usersRoutes);

mongoose
    .connect('mongodb+srv://grzesiek:grzesiek@cluster0.wcshf.mongodb.net/best-bookstore?retryWrites=true&w=majority')
    .then(() => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });
