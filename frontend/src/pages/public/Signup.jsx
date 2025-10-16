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
    role: 'Traveler',
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
      const data = await signupService({ name, email, password, role });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Create an Account</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label htmlFor="name" className="text-sm font-bold text-gray-600 block">Name</label>
            <input id="name" type="text" name="name" value={name} onChange={onChange} className="w-full p-2 border border-gray-300 rounded mt-1" required />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-600 block">Email</label>
            <input id="email" type="email" name="email" value={email} onChange={onChange} className="w-full p-2 border border-gray-300 rounded mt-1" required />
          </div>
          <div>
            <label htmlFor="password"  className="text-sm font-bold text-gray-600 block">Password</label>
            <input id="password" type="password" name="password" value={password} onChange={onChange} className="w-full p-2 border border-gray-300 rounded mt-1" required />
          </div>
          <div>
            <label htmlFor="password2" className="text-sm font-bold text-gray-600 block">Confirm Password</label>
            <input id="password2" type="password" name="password2" value={password2} onChange={onChange} className="w-full p-2 border border-gray-300 rounded mt-1" required />
          </div>
          <div>
            <label htmlFor="role" className="text-sm font-bold text-gray-600 block">Sign up as a:</label>
            <select id="role" name="role" value={role} onChange={onChange} className="w-full p-2 border border-gray-300 rounded mt-1">
              <option value="Traveler">Traveler</option>
              <option value="Host">Host</option>
            </select>
          </div>
          <div>
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm">
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;