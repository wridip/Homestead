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
      <div className="w-full max-w-md p-8 space-y-6 bg-card/50 rounded-2xl shadow-lg backdrop-blur-sm border border-border">
        <h2 className="text-2xl font-bold text-center text-foreground">Create an Account</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <p className="text-destructive text-sm bg-destructive/10 border border-destructive/50 p-2 rounded text-center">{error}</p>}
          <div>
            <label htmlFor="name" className="text-sm font-bold text-muted-foreground block">Name</label>
            <input id="name" type="text" name="name" value={name} onChange={onChange} className="w-full p-2 bg-background border border-border rounded mt-1 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="John Doe" required />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-bold text-muted-foreground block">Email</label>
            <input id="email" type="email" name="email" value={email} onChange={onChange} className="w-full p-2 bg-background border border-border rounded mt-1 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="john@example.com" required />
          </div>
          <div>
            <label htmlFor="password"  className="text-sm font-bold text-muted-foreground block">Password</label>
            <input id="password" type="password" name="password" value={password} onChange={onChange} className="w-full p-2 bg-background border border-border rounded mt-1 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="••••••••" required />
          </div>
          <div>
            <label htmlFor="password2" className="text-sm font-bold text-muted-foreground block">Confirm Password</label>
            <input id="password2" type="password" name="password2" value={password2} onChange={onChange} className="w-full p-2 bg-background border border-border rounded mt-1 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="••••••••" required />
          </div>
          {/* Role Selection */}
          <div className="bg-background/50 p-3 rounded-xl border border-border">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-3">I want to join as a:</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${role === 'Traveler' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                <input
                  type="radio"
                  name="role"
                  value="Traveler"
                  checked={role === 'Traveler'}
                  onChange={onChange}
                  className="hidden"
                />
                <span className={`text-sm font-bold ${role === 'Traveler' ? 'text-primary' : 'text-muted-foreground'}`}>Traveler</span>
              </label>
              <label className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${role === 'Host' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                <input
                  type="radio"
                  name="role"
                  value="Host"
                  checked={role === 'Host'}
                  onChange={onChange}
                  className="hidden"
                />
                <span className={`text-sm font-bold ${role === 'Host' ? 'text-primary' : 'text-muted-foreground'}`}>Host</span>
              </label>
            </div>
          </div>

          <div className="flex justify-center py-2">
            {import.meta.env.VITE_RECAPTCHA_SITE_KEY && import.meta.env.VITE_SKIP_CAPTCHA !== 'true' ? (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={onCaptchaChange}
                theme="dark"
              />
            ) : import.meta.env.VITE_SKIP_CAPTCHA === 'true' ? (
              <p className="text-primary text-xs text-center bg-primary/10 p-2 rounded-lg border border-primary/20">
                CAPTCHA skipped for testing.
              </p>
            ) : (
              <p className="text-amber-500 text-xs text-center bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                reCAPTCHA Site Key missing. Please check your .env file.
              </p>
            )}
          </div>

          <div>
            <button type="submit" className="w-full py-3 px-4 bg-primary hover:bg-primary/90 rounded-xl text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 transition-all duration-200 active:scale-[0.98]">
              Create Account
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-muted-foreground font-medium pt-2">
          Already have an account? <Link to="/login" className="text-primary hover:text-primary/80 font-bold ml-1 transition-colors">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;