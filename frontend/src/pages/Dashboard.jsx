import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { UsersIcon, UserGroupIcon, ShieldCheckIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getExampleUsageStats, EXAMPLES } from './PromptEngineering';
import { exampleUsageService } from '../services/exampleUsageService';

const StatCard = ({ title, value, icon, color, gradient }) => {
    const IconComponent = icon;
    return (
        <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${gradient}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <div className={`p-4 rounded-full ${color}`}>
                    <IconComponent className="h-8 w-8 text-white" />
                </div>
            </div>
        </div>
    );
};

const RolesChart = ({ data }) => {
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B']; // Blue, Green, Yellow

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <ChartBarIcon className="h-6 w-6 mr-2 text-blue-600" />
                User Roles Distribution
            </h2>
            <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const RecentUsers = ({ users }) => {
    const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <UsersIcon className="h-6 w-6 mr-2 text-green-600" />
                Recent Registrations
            </h2>
            <div className="space-y-4">
                {recentUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                                </span>
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm font-semibold text-gray-900">{user.firstname} {user.lastname}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.role === 'ADMIN' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-green-100 text-green-800'
                            }`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ExampleUsageChart = ({ exampleUsage }) => {
    const chartData = Object.entries(exampleUsage).map(([idx, count]) => ({
        name: EXAMPLES[idx]?.label || `Example #${idx}`,
        usage: count
    }));

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <ChartBarIcon className="h-6 w-6 mr-2 text-indigo-600" />
                Example Usage Statistics
            </h2>
            <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Bar dataKey="usage" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
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
                setAllUsers(users);
                const total = users.length;
                const admins = users.filter(u => u.role === 'ADMIN').length;
                const regularUsers = users.filter(u => u.role === 'USER').length;
                setStats({ total, admins, users: regularUsers });
                
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
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome to your admin panel overview</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Last updated</p>
                    <p className="text-sm font-medium text-gray-900">{new Date().toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Users" 
                    value={stats.total} 
                    icon={UsersIcon}
                    color="bg-gradient-to-r from-blue-500 to-blue-600"
                    gradient="hover:from-blue-600 hover:to-blue-700"
                />
                <StatCard 
                    title="Administrators" 
                    value={stats.admins} 
                    icon={ShieldCheckIcon}
                    color="bg-gradient-to-r from-red-500 to-red-600"
                    gradient="hover:from-red-600 hover:to-red-700"
                />
                <StatCard 
                    title="Regular Users" 
                    value={stats.users} 
                    icon={UserGroupIcon}
                    color="bg-gradient-to-r from-green-500 to-green-600"
                    gradient="hover:from-green-600 hover:to-green-700"
                />
                <StatCard
                    title="Prompt Example Runs"
                    value={Object.values(exampleUsage).reduce((a, b) => a + b, 0)}
                    icon={ChartBarIcon}
                    color="bg-gradient-to-r from-indigo-500 to-indigo-600"
                    gradient="hover:from-indigo-600 hover:to-indigo-700"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <RecentUsers users={allUsers} />
                <RolesChart data={chartData} />
            </div>

            <ExampleUsageChart exampleUsage={exampleUsage} />
        </div>
    );
};

export default Dashboard;
