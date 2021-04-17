var jwt = require('jsonwebtoken');

 
const accessTokenSecret = "secret";
function verifyToken(req, res, next) {

  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      jwt.verify(req.headers.authorization.split(' ')[1], accessTokenSecret , (
          err,
          decode
      ) => {
          if (err) 
              req.user = undefined;
          req.user = decode;
          next();
      });

  } else {

      req.user = undefined;

      next();

  }

}
 

 
module.exports = {verifyToken};