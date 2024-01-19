import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    // Get the token from the request headers
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        next('Token is required Auth failed');
    }

   const token = authHeader.split(' ')[1];

 // authMiddleware.js
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = { userId: decoded.id, name: decoded.name, email: decoded.email, location: decoded.location };
    next();
} catch (error) {
    next('Not authorized, token failed');
}


};
export default authUser;
