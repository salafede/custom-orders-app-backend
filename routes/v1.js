
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {authMiddle, authSuperMiddle, checkToken, checkSuperToken} = require('./auth-middleware');
const { websockets } = require('../libs/websockets');

// replace this with actual MONGODB MODELS
const { Sample } = require('../models/sample-model');

// Sample to implement auth with JWT without users db
router.post('/auth', async (req, res)=> {

    if (!req.body) return res.status(400).send("Invalid Body");

    if (req.body.username != process.env.SU_USER) return res.status(400).send("Invalid login");
    if (req.body.password != process.env.SU_PASS) return res.status(400).send("Invalid login");

    let token = jwt.sign({ username: req.body.username, superAdmin: true }, process.env.JWT_SIGN);
    return res.send({token});
});

// sample get request
router.get("/", (req, res)=>{
    return res.send("Works!");
});

router.get("/orders", (req, res)=>{
    return res.send(["scarpa1", "scarpa2"]);
});

// Sample to understand ws usage
router.ws('/samples', async function(ws, req) {
    if (!req.query.token) return ws.close();
    if (!await checkToken(req.query.token)) return ws.close();
    ws.shape = 'backend.v1.samples';
    
    let samples = await Sample.find();
    try {
        ws.send(JSON.stringify({
            shape: 'backend.v1.samples',
            samples
        }), function ack(error) {
            if(error == undefined)
                return;
            ws.close();
            console.log("WS Async error:"+error, new Date());
        });
    } catch (e) {
            console.log("WS Sync error:"+e, new Date());
            ws.close();
    }
  });
// Sample to undersand multiple updates of all the listeners
  async function updateSamples() {
    let samples = await Sample.find();
    let data = JSON.stringify({
      shape: 'backend.v1.samples',
      samples
  });
  websockets.aWss.clients.forEach(function (client) {
      if (client.shape != 'backend.v1.samples') return;
      client.send(data);
    });
}

module.exports = router;