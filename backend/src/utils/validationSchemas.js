const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Traveler', 'Host').required(),
  captchaToken: Joi.string().optional().allow(null, ''),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  captchaToken: Joi.string().optional().allow(null, ''),
});

module.exports = {
  signupSchema,
  loginSchema,
};
