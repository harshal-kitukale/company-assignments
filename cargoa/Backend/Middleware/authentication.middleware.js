// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// function authentication(req, res, next) {
//   const token = req.headers?.authorization;
//   if (token) {
//     jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
//       if (decoded) {
//         req.body.userID = decoded.userID;
//         next();
//       } else {
//         res.status(400).send({ msg: "Error Occurred" });
//       }
//     });
//   } else res.status(400).send({ msg: "Login First" });
// }

// module.exports = { authentication };

const jwt = require('jsonwebtoken');
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) return res.status(401).json({ message: 'Authentication token is required' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
