import jwt from "jsonwebtoken";

const authGuard = (req, res, next) => {
  const SECRET = "HELd31LO31KE@Y";

  // Check if the Authorization header exists
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: "No token found. Please login.",
    });
  }

  // Extract the token from the Authorization header
  const token = req.headers.authorization.split(" ")[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      message: "No token found. Please login.",
    });
  }

  // Verify the token
  jwt.verify(token, SECRET, (error, decodedToken) => {
    if (error) {
      // If error while decoding
      console.log(error.message);
      return res.status(401).json({
        message: "Invalid Token.",
      });
    }

    // If verification succeeds, attach user info to the request
    req.user = decodedToken;

    // Proceed to the next middleware or route
    next();
  });
};

export default authGuard;
