import React, { useState, useContext, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';
import { signup as signupService } from '../../services/authService';
import ReCAPTCHA from "react-google-recaptcha";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'Traveler', // Default role
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState(null);
  const recaptchaRef = useRef(null);

  const { name, email, password, password2, role } = formData;

  const from = location.state?.from?.pathname || '/dashboard';

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      return setError('Passwords do not match');
    }
    const isSkipCaptcha = import.meta.env.VITE_SKIP_CAPTCHA === 'true';

    if (import.meta.env.VITE_RECAPTCHA_SITE_KEY && !captchaToken && !isSkipCaptcha) {
      return setError('Please complete the CAPTCHA');
    }
    try {
      const data = await signupService({ name, email, password, role, captchaToken }); // Pass role and captchaToken to service
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-neutral-900/50 rounded-2xl shadow-lg backdrop-blur-sm border border-neutral-800">
        <h2 className="text-2xl font-bold text-center text-neutral-200">Create an Account</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/50 p-2 rounded text-center">{error}</p>}
          <div>
            <label htmlFor="name" className="text-sm font-bold text-neutral-400 block">Name</label>
            <input id="name" type="text" name="name" value={name} onChange={onChange} className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded mt-1 text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="John Doe" required />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-bold text-neutral-400 block">Email</label>
            <input id="email" type="email" name="email" value={email} onChange={onChange} className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded mt-1 text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="john@example.com" required />
          </div>
          <div>
            <label htmlFor="password"  className="text-sm font-bold text-neutral-400 block">Password</label>
            <input id="password" type="password" name="password" value={password} onChange={onChange} className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded mt-1 text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="••••••••" required />
          </div>
          <div>
            <label htmlFor="password2" className="text-sm font-bold text-neutral-400 block">Confirm Password</label>
            <input id="password2" type="password" name="password2" value={password2} onChange={onChange} className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded mt-1 text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="••••••••" required />
          </div>
          {/* Role Selection */}
          <div className="bg-neutral-800/50 p-3 rounded-xl border border-neutral-700">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-3">I want to join as a:</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${role === 'Traveler' ? 'border-purple-600 bg-purple-600/10' : 'border-neutral-700 hover:border-neutral-600'}`}>
                <input
                  type="radio"
                  name="role"
                  value="Traveler"
                  checked={role === 'Traveler'}
                  onChange={onChange}
                  className="hidden"
                />
                <span className={`text-sm font-bold ${role === 'Traveler' ? 'text-purple-400' : 'text-neutral-400'}`}>Traveler</span>
              </label>
              <label className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${role === 'Host' ? 'border-purple-600 bg-purple-600/10' : 'border-neutral-700 hover:border-neutral-600'}`}>
                <input
                  type="radio"
                  name="role"
                  value="Host"
                  checked={role === 'Host'}
                  onChange={onChange}
                  className="hidden"
                />
                <span className={`text-sm font-bold ${role === 'Host' ? 'text-purple-400' : 'text-neutral-400'}`}>Host</span>
              </label>
            </div>
          </div>

          <div className="flex justify-center py-2">
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
            <button type="submit" className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-bold text-sm shadow-lg shadow-purple-900/20 transition-all duration-200 active:scale-[0.98]">
              Create Account
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-neutral-400 font-medium pt-2">
          Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold ml-1 transition-colors">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;