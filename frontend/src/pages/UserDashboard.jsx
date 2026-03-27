import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    toast.info('Redirecting to My Orders...');
    navigate('/my-orders');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Dashboard</h1>
        <p className="text-lg text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default UserDashboard;
