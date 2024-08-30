'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'team member'>('team member');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/register', { email, password, role });
      localStorage.setItem('token', data.token);
      router.push('/login'); // Redirect to login after successful registration
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="register-container flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="register-form w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'team member')}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="team member">Team Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
            Register
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <div className="login-link-container text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">Login Now</a>
          </p>
        </div>
      </div>
    </div>
  );
}