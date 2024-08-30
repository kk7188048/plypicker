'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/mainheader';
import Spin from '@/components/spin';
const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch('/api/auth/profile'); // Fetch profile to get role
        if (res.ok) {
          const userData = await res.json();
          if (userData.role === 'admin') {
            router.push('/dashboard/admin'); // Redirect to admin dashboard
          } else if (userData.role === 'team member') {
            router.push('/dashboard/team'); // Redirect to team member dashboard
          } else {
            router.push('/login'); // Redirect to login if role is not recognized
          }
        } else {
          router.push('/login'); // Redirect to login on fetch error
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        router.push('/login');
      }
    };

    fetchUserRole();
  }, [router]);

  return (
    <div className='justify-center items-center flex flex-col min-h-screen'>
      <Spin />
    </div>)

};

export default DashboardPage;
