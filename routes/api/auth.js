const express = require('express');
const router = express.Router();

const {validateUserRegister} = require('../../utils/validation');
const {verifyToken, signAndSendToken} = require('../../middleware/tokenHandler');

const bcrypt = require('bcrypt');

const User = require('../../models/User');


router.post('/register', async (req, res) => {
  
  const {error} = validateUserRegister(req.body);

  if(error){
    return res.status(400).send(error);
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  });

  try{
    await user.save();
  } catch(err){
    return res.status(400).send(err);
  }

  res.send();
});


router.post('/login', async (req, res, next) => {

  if(!req.body.email || !req.body.password){
    return res.status(400).send('No email and / or password provided');
  }

  const user = await User.findOne({ email: req.body.email });

  if(!user){
    return res.status(401).send('Wrong email and / or password');
  }

  const isAuthenticated = await bcrypt.compare(req.body.password, user.password);

  if(!isAuthenticated){
    return res.status(401).send('Wrong email and / or password');
  }

  req.body.user = user;

  next();

}, signAndSendToken);


router.post('/refresh', verifyToken, async (req, res, next) => {

  const decoded = req.body.authTokenDecoded;

  const user = await User.findOne({ email: decoded.email });

  if(!user){
    return res.status(401).send('Invalid token');
  }

  req.body.user = user;

  next();

}, signAndSendToken);


module.exports = router;