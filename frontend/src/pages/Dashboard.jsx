import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { UsersIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getExampleUsageStats, EXAMPLES } from './PromptEngineering';
import { exampleUsageService } from '../services/exampleUsageService';

const StatCard = ({ title, value, icon, color }) => {
    const IconComponent = icon;
    return (
        <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
            <div className="flex items-center">
                <div className="p-3 bg-gray-100 rounded-full">
                    <IconComponent className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
};

const RolesChart = ({ data }) => {
    const COLORS = ['#FF8042', '#00C49F']; // Orange for Admins, Green for Users

    return (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md" style={{ height: '400px' }}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">User Roles Distribution</h2>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

const RecentUsers = ({ users }) => {
    // Sort users by creation date, newest first, and take the top 5
    const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Registrations</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Name</th>
                            <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Email</th>
                            <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Joined On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentUsers.map(user => (
                            <tr key={user.id}>
                                <td className="py-2 px-4 border-b text-sm text-gray-800">{user.firstname} {user.lastname}</td>
                                <td className="py-2 px-4 border-b text-sm text-gray-800">{user.email}</td>
                                <td className="py-2 px-4 border-b text-sm text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, admins: 0, users: 0 });
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [exampleUsage, setExampleUsage] = useState({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const users = await userService.getUsers();
                setAllUsers(users); // Save all users for the recent list
                const total = users.length;
                const admins = users.filter(u => u.role === 'ADMIN').length;
                const regularUsers = users.filter(u => u.role === 'USER').length;
                setStats({ total, admins, users: regularUsers });
                
                // Fetch example usage stats from backend
                const usageStats = await exampleUsageService.getUsageStats();
                setExampleUsage(usageStats);
            } catch (err) {
                setError('Could not fetch dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const chartData = [
        { name: 'Admins', value: stats.admins },
        { name: 'Users', value: stats.users },
    ];

    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Users" 
                    value={stats.total} 
                    icon={UsersIcon}
                    color="border-blue-500"
                />
                <StatCard 
                    title="Administrators" 
                    value={stats.admins} 
                    icon={ShieldCheckIcon}
                    color="border-red-500"
                />
                <StatCard 
                    title="Regular Users" 
                    value={stats.users} 
                    icon={UserGroupIcon}
                    color="border-green-500"
                />
                <StatCard
                    title="Prompt Example Runs"
                    value={Object.values(exampleUsage).reduce((a, b) => a + b, 0)}
                    icon={UsersIcon}
                    color="border-indigo-500"
                />
            </div>

            <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
                <RecentUsers users={allUsers} />
                <RolesChart data={chartData} />
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Interactive Example Usage</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Example</th>
                                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-500">Runs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(exampleUsage).map(([idx, count]) => (
                                <tr key={idx}>
                                    <td className="py-2 px-4 border-b text-sm text-gray-800">{EXAMPLES[idx]?.label || `Example #${idx}`}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-800">{count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
