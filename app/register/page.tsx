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
      router.push('/login'); // Redirect to dashboard after successful registration
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="register-container flex items-center justify-center min-h-screen bg-gray-100">
      <div className="register-form w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'team member')}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="team member">Team Member</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="register-btn w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
            Register
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>

        <div className="login-link-container text-center mt-4">
          <p>Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login Now</a></p>
        </div>
      </div>
    </div>
  );
}