const jwt = require('jsonwebtoken');


function authMiddle(req, res, next) {
    const token = req.body.token || req.params.token || req.headers['x-auth-token'] || req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');
    jwt.verify(token, process.env.JWT_SIGN, function(err, decoded) {
        if (err) return res.status(400).send('invalid token.');
        req.user = decoded;
        next();
        });
}

function authSuperMiddle(req, res, next) {
    const token = req.body.token || req.params.token || req.headers['x-auth-token'] || req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');
    jwt.verify(token, process.env.JWT_SIGN, function(err, decoded) {
        if (err) return res.status(400).send('invalid token.');
        req.user = decoded;
        if (!req.user.superAdmin)  return res.status(403).send('Unauthorized!');
        next();
        });
}

function checkSuperToken(token) {
    return new Promise ((resolve) => {
        jwt.verify(token, process.env.JWT_SIGN, function(err, decoded) {
            if (err) return resolve(false);
            if (!decoded.superAdmin)  return resolve(false);
            return resolve(decoded);
            });
    });
    
}

function checkToken(token) {
    return new Promise ((resolve) => {
        jwt.verify(token, process.env.JWT_SIGN, function(err, decoded) {
            if (err) return resolve(false);
            return resolve(decoded);
            });
    });
    
}

module.exports.authMiddle = authMiddle;
module.exports.authSuperMiddle = authSuperMiddle;
module.exports.checkSuperToken = checkSuperToken;
module.exports.checkToken = checkToken;