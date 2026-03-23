import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';
import { login as loginService, googleLogin as googleLoginService } from '../../services/authService';
import { GoogleLogin } from '@react-oauth/google';
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState(null);
  const emailInputRef = useRef(null);
  const recaptchaRef = useRef(null);

  const { email, password } = formData;
  
  const from = location.state?.from?.pathname || '/';

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const isSkipCaptcha = import.meta.env.VITE_SKIP_CAPTCHA === 'true';

    if (import.meta.env.VITE_RECAPTCHA_SITE_KEY && !captchaToken && !isSkipCaptcha) {
      setError("Please complete the CAPTCHA");
      return;
    }
    try {
      const data = await loginService({ email, password, captchaToken });
      login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaToken(null);
    }
  };

  const onGoogleSuccess = async (credentialResponse) => {
    try {
      const data = await googleLoginService(credentialResponse.credential);
      login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Google Login failed');
    }
  };

  const onGoogleError = () => {
    setError('Google Login failed');
  };

  useEffect(() => {
    if (error && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-neutral-900/50 rounded-2xl shadow-xl backdrop-blur-sm border border-neutral-800">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-white tracking-tight">Login</h2>
          <p className="mt-2 text-center text-sm text-neutral-400 italic">Welcome back to Homestead</p>
        </div>
        
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center animate-shake" role="alert">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Email Address</label>
              <input
                ref={emailInputRef}
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-neutral-600"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" name="password" className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-neutral-600"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={onCaptchaChange}
                theme="dark"
              />
            ) : (
              <p className="text-amber-500 text-xs text-center bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                reCAPTCHA Site Key missing. Please check your .env file.
              </p>
            )}
          </div>

          <div>
            <button type="submit" className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] rounded-xl text-white font-bold text-sm shadow-lg shadow-purple-900/20 transition-all duration-200">
              Sign In
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-sm uppercase tracking-tighter">
            <span className="px-3 bg-[#121212] text-neutral-500 font-medium">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center w-full mt-4">
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={onGoogleError}
            theme="filled_black"
            shape="pill"
            text="signin_with"
          />
        </div>

        <p className="mt-8 text-center text-sm text-neutral-400 font-medium">
          Don't have an account? <Link to="/signup" className="text-purple-400 hover:text-purple-300 transition-colors font-bold ml-1">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;