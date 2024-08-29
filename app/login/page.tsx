'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      router.push('/dashboard/team');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="login-container flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-700">
      <div className="login-form w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Welcome Back!</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button type="submit" className="login-btn w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
            Login
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        {/* <div className="forgot-password-link text-center mt-4">
          <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
        </div> */}
        <div className="login-link-container text-center mt-4">
          <p>New user? <a href="/register" className="text-blue-500 hover:underline">Create an Account</a></p>
        </div>
      </div>
    </div>
  );
}