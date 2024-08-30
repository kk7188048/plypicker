'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Background } from '@/components/Background';
import Header from '@/components/mainheader';

interface Stats {
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
}

export default function ProfilePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await axios.get('/api/stats');
        setStats(response.data);
        console.log('Stats fetched:', response.data);
      } catch (error) {
        console.error('Error fetching stats', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) return <div className="text-center text-lg">Loading...</div>;

  if (!stats) return <div className="text-center text-lg text-red-500">Error loading stats</div>;

  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen">
      <Header />
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Profile Stats</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800">Total Requests</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalRequests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800">Approved Requests</h2>
          <p className="text-3xl font-bold text-green-600">{stats.approvedRequests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800">Rejected Requests</h2>
          <p className="text-3xl font-bold text-red-600">{stats.rejectedRequests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-800">Pending Requests</h2>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</p>
        </div>
      </div>
    </div>
  );
}