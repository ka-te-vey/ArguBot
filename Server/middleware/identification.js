const jwt = require('jsonwebtoken');
const Joi = require('joi');

exports.identifier = (req, res, next) => {
    let token;
    if (req.headers.client === 'not-browser'){
        token = req.headers.authorization;
    } else {
        token = req.cookies['authorization'] || req.cookies['Authorization'];
    }

    if(!token) {
        return res.status(403).json({ success:false, message: 'Unauthorization!' })
    }

    try {
        const userToken = token.split(' ')[1]
        const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);

        if(jwtVerified) {
            req.user = jwtVerified;
            next()
        } else {
            return res.status(403).json({ success:false, message: 'Unauthorized or Invalid token!' });
        }
    } catch (error) {
        return res.status(500).json({ success:false, message: 'An error occurred while verifying the token!' });
    }
};