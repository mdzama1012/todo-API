const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        res.status(403).json({ message: 'Forbidden: Invalid token' });
        return;
    }
    try {
        const decodePayload = jwt.verify(token, process.env.JWT_USER);
        req.userId = decodePayload.userId;
        next();
    } catch {
        res.set(
            'WWW-Authenticate',
            'Bearer error="invalid_token", error_description="Invalid or expired token"',
        )
            .status(401)
            .json({ message: 'Unauthorized' });
    }
}

module.exports = { auth };
