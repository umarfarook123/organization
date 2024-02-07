const allowedOrigins = ["http://localhost:3000"];
const jwt = require("jsonwebtoken");
const passport = require("passport");
const config = require('../config/config')

exports.isOriginVerify = (req, res, next) => {
  let origin = req.headers["origin"];

  var index = allowedOrigins.indexOf(origin);
  if (index > -1) {
    next();
  } else {
    return res.json({ status: 401, message: "Unauthorized Request" });
  }
};

exports.jwtVerify = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) return res.json({ status: 401, message: "token is required" })

  try {
    req.userId = jwt.verify(token, "SECRETDKHDWK").userId;
    next()
  } catch (err) {

    return res.json({ status: 400, message: "Invalid token" });
  }
};



exports.authenticateJWT = (roles = '') => (req, res, next) => {


  passport.authenticate('jwt', { session: false }, (err, user) => {

    if (err) {
      // Handle JWT authentication errors here
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired' });
      }
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (roles == 'admin' && roles !== user.role) return res.status(401).json({ error: 'You are not allowed!' });


    // User is authenticated, you can proceed with the protected logic
    req.user = user; // Attach the user to the request object
    next();
  })(req, res, next);
};
