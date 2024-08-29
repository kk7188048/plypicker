'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Stats {
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
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

  if (loading) return <div>Loading...</div>;

  if (!stats) return <div>Error loading stats</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold">Your Stats</h2>
          <p>Total Requests: {stats.totalRequests}</p>
          <p>Approved Requests: {stats.approvedRequests}</p>
          <p>Rejected Requests: {stats.rejectedRequests}</p>
        </div>
      </div>
    </div>
  );
}
