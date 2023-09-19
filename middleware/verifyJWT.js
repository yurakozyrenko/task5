const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.sendStatus(401);
        }
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                throw new Error('invalid token');
            }
            req.user = user;
            next();
        });
    } catch (err) {
        res.status(403).send('invalid token');
    }
};

module.exports = verifyJWT;
