const Joi = require('joi');

function extractError({ value, error }){
  if(!error){
    return { value };
  }

  return {
    value,
    error: error.details[0].message
  };
}

function validateUserRegister(data){

  const schema = Joi.object({
    username: Joi.string().alphanum().min(4).max(16).required(),
    email: Joi.string().email().max(32).required(),
    password: Joi.string().min(8).max(64).required()
  });

  const validation = schema.validate(data);
  return extractError(validation);
}

function validateBlog(data){

  const schema = Joi.object({
    title: Joi.string().max(128).required(),
    subtitle: Joi.string().max(512).required(),
    content: Joi.string().max(4096).required()
  });

  const validation = schema.validate(data);
  return extractError(validation);
}

module.exports.validateUserRegister = validateUserRegister;
module.exports.validateBlog = validateBlog;