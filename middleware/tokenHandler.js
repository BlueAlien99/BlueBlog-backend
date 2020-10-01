const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {

  const token = req.body.authToken;

  if(!token){
    return res.status(400).send('No authentication token provided');
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    req.body.authTokenDecoded = decoded;
    next();
  } catch(err){
    res.status(401).send('Invalid token');
  }
}

function signAndSendToken(req, res){

  const user = req.body.user;

  const token = jwt.sign({
    username: user.username,
    email: user.email
  }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '24h' });

  res.set('auth-token', token).send({
    username: user.username,
    authToken: token
  });
}

module.exports.verifyToken = verifyToken;
module.exports.signAndSendToken = signAndSendToken;