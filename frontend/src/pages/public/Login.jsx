import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';
import { login as loginService } from '../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const data = await loginService({ email, password });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-neutral-900/50 rounded-2xl shadow-lg backdrop-blur-sm border border-neutral-800">
        <h2 className="text-2xl font-bold text-center text-neutral-200">Login</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label htmlFor="email" className="text-sm font-bold text-neutral-400 block">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded mt-1 text-neutral-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-neutral-400 block">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded mt-1 text-neutral-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <button type="submit" className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm">
              Login
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-neutral-400">
          Don't have an account? <Link to="/signup" className="text-purple-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;