const express = require('express');
const router = express.Router();

const {validateUserRegister} = require('../../utils/validation');

const bcrypt = require('bcrypt');

const User = require('../../models/User');

const jwt = require('jsonwebtoken');


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


router.post('/login', async (req, res) => {

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

  const token = jwt.sign({
    username: user.username,
    email: user.email
  }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '24h' });

  res.set('auth-token', token).send();
});


module.exports = router;