const axios = require('axios');

const verifyCaptcha = async (req, res, next) => {
  const { captchaToken } = req.body;

  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn('RECAPTCHA_SECRET_KEY is not set. Skipping CAPTCHA verification.');
    return next();
  }

  if (!captchaToken) {
    return res.status(400).json({ success: false, message: 'Please complete the CAPTCHA' });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
    );

    if (response.data.success) {
      next();
    } else {
      res.status(400).json({ success: false, message: 'CAPTCHA verification failed' });
    }
  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during CAPTCHA verification' });
  }
};

module.exports = { verifyCaptcha };
