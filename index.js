require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const websockets = require('./libs/websockets');

const app = express();
const port = process.env.PORT;
const www = './www';

// Connecting to MONGODB
const optionsDB = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    "auth": {"authSource": process.env.DB_AUTH},
    "user": process.env.DB_USER,
    "pass": process.env.DB_PASS
}

mongoose.connect(process.env.DB_URL, optionsDB)
  .then(() => console.log(process.env.DB_USER + ' connected to MongoDB!'))
  .catch(err=> console.error(err));

// Handling websockets

  websockets.expressWs = require('express-ws')(app);
  websockets.aWss = websockets.expressWs.getWss('/');
  
// Middleware Here
app.use(express.json({limit: '50mb'}));
  // only if needed
// app.use(express.urlencoded({extended:false}));
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type', 'x-auth-token'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }));

//IMPORT routes
const api_v1 = require('./routes/v1');
app.use('/api', api_v1);

// Static content
app.use(express.static(www));
app.get('*', (req, res) => {
    console.log(req.url);
    res.sendFile(`index.html`, { root: www });
});

// server start
app.listen(port, () => console.log(`nodejs-express-backend-template: listening on http://localhost:${port}`));