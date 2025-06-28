import React, { useState, useEffect } from 'react';
import { userPromptService } from '../services/userPromptService';
import { authService } from '../services/authService';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [prompts, setPrompts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPrompt, setNewPrompt] = useState({ title: '', promptContent: '', category: '' });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        loadPrompts();
    }, []);

    const loadPrompts = async () => {
        try {
            setLoading(true);
            const [allPrompts, userFavorites] = await Promise.all([
                userPromptService.getUserPrompts(),
                userPromptService.getUserFavorites()
            ]);
            setPrompts(allPrompts);
            setFavorites(userFavorites);
        } catch (error) {
            console.error('Error loading prompts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePrompt = async () => {
        try {
            await userPromptService.createUserPrompt(newPrompt);
            setShowCreateModal(false);
            setNewPrompt({ title: '', promptContent: '', category: '' });
            loadPrompts();
        } catch (error) {
            console.error('Error creating prompt:', error);
        }
    };

    const handleToggleFavorite = async (promptId) => {
        try {
            await userPromptService.toggleFavorite(promptId);
            loadPrompts();
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleDeletePrompt = async (promptId) => {
        if (window.confirm('Are you sure you want to delete this prompt?')) {
            try {
                await userPromptService.deleteUserPrompt(promptId);
                loadPrompts();
            } catch (error) {
                console.error('Error deleting prompt:', error);
            }
        }
    };

    const handleUsePrompt = async (promptId) => {
        try {
            await userPromptService.incrementUsage(promptId);
            loadPrompts();
        } catch (error) {
            console.error('Error incrementing usage:', error);
        }
    };

    const categories = ['Summarization', 'Translation', 'Code Generation', 'Creative Writing', 'Classification', 'Extraction', 'Role-playing'];

    const renderPromptCard = (prompt) => (
        <div key={prompt.id} className="bg-white p-4 rounded-lg shadow-md border">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{prompt.title}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleToggleFavorite(prompt.id)}
                        className={`p-1 rounded ${prompt.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        onClick={() => handleDeletePrompt(prompt.id)}
                        className="text-red-500 p-1 rounded hover:bg-red-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{prompt.category}</p>
            <p className="text-gray-700 mb-3 font-mono text-sm bg-gray-50 p-2 rounded">
                {prompt.promptContent}
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Used {prompt.usageCount} times</span>
                <button
                    onClick={() => handleUsePrompt(prompt.id)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                >
                    Use Prompt
                </button>
            </div>
        </div>
    );

    if (loading) {
        return <div className="text-center py-8">Loading profile...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
                {user && (
                    <p className="text-gray-600">Welcome back, {user.email}</p>
                )}
            </div>

            <div className="mb-6">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                >
                    Create New Prompt
                </button>
            </div>

            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'all'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            All Prompts ({prompts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'favorites'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Favorites ({favorites.length})
                        </button>
                    </nav>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === 'all' ? prompts : favorites).map(renderPromptCard)}
            </div>

            {/* Create Prompt Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl transform transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Create New Prompt</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={newPrompt.title}
                                    onChange={(e) => setNewPrompt({...newPrompt, title: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="Enter prompt title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={newPrompt.category}
                                    onChange={(e) => setNewPrompt({...newPrompt, category: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Prompt Content</label>
                                <textarea
                                    value={newPrompt.promptContent}
                                    onChange={(e) => setNewPrompt({...newPrompt, promptContent: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    rows={6}
                                    placeholder="Enter your prompt content here..."
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePrompt}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Prompt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile; 