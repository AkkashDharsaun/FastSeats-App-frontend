import React from "react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-2xl font-semibold mt-1">1,250</h2>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Active Users</p>
          <h2 className="text-2xl font-semibold mt-1">860</h2>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Messages</p>
          <h2 className="text-2xl font-semibold mt-1">342</h2>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <h2 className="text-2xl font-semibold mt-1">₹45,000</h2>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-3 text-sm text-gray-600">
          <li>👤 New user registered</li>
          <li>✉️ New message received</li>
          <li>⚙️ Settings updated</li>
          <li>📊 Analytics report generated</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
