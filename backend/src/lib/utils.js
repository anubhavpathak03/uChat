import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"7d"
    });

    // Development mode cookie settings
    res.cookie('jwt_token', token, {
        maxAge: 7*24*60*60*1000, // 7days -> in millisecond
        httpOnly: true, // prevents XSS attack cross-site scripting attacks
        sameSite: "lax", // Use 'lax' in development for better dev experience
        secure: false, // Don't require HTTPS in development
        path: "/",
    });

    return token;
}