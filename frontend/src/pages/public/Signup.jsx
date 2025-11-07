import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';
import { signup as signupService } from '../../services/authService';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'Traveler', // Default role
  });
  const [error, setError] = useState(null);

  const { name, email, password, password2, role } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      return setError('Passwords do not match');
    }
    try {
      const data = await signupService({ name, email, password, role }); // Pass role to service
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="w-full max-w-md p-8 space-y-6 bg-neutral-900/50 rounded-2xl shadow-lg backdrop-blur-sm border border-neutral-800">
        <h2 className="text-2xl font-bold text-center text-neutral-200">Create an Account</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label htmlFor="name" className="text-sm font-bold text-neutral-400 block">Name</label>
            <input id="name" type="text" name="name" value={name} onChange={onChange} className="w-full p-2 bg-transparent border border-neutral-700 rounded mt-1 text-white" required />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-bold text-neutral-400 block">Email</label>
            <input id="email" type="email" name="email" value={email} onChange={onChange} className="w-full p-2 bg-transparent border border-neutral-700 rounded mt-1 text-white" required />
          </div>
          <div>
            <label htmlFor="password"  className="text-sm font-bold text-neutral-400 block">Password</label>
            <input id="password" type="password" name="password" value={password} onChange={onChange} className="w-full p-2 bg-transparent border border-neutral-700 rounded mt-1 text-white" required />
          </div>
          <div>
            <label htmlFor="password2" className="text-sm font-bold text-neutral-400 block">Confirm Password</label>
            <input id="password2" type="password" name="password2" value={password2} onChange={onChange} className="w-full p-2 bg-transparent border border-neutral-700 rounded mt-1 text-white" required />
          </div>
          {/* Role Selection */}
          <div>
            <label className="text-sm font-bold text-neutral-400 block">I am a:</label>
            <div className="flex items-center mt-2">
              <input
className="h-4 w-4 text-purple-600 bg-transparent border-neutral-700 focus:ring-purple-500"
              />
              <label htmlFor="role-traveler" className="ml-2 block text-sm text-neutral-200">
                Traveler
              </label>
            </div>
            <div className="flex items-center mt-2">
              <input
                id="role-host"
                type="radio"
                name="role"
                value="Host"
                checked={role === 'Host'}
                onChange={onChange}
                className="h-4 w-4 text-purple-600 bg-transparent border-neutral-700 focus:ring-purple-500"
              />
              <label htmlFor="role-host" className="ml-2 block text-sm text-neutral-200">
                Host
              </label>
            </div>
          </div>
          <div>
            <button type="submit" className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm">
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-neutral-400">
          Already have an account? <Link to="/login" className="text-purple-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;