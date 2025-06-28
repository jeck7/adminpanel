import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';

const AIAssistant = ({ currentPrompt, onPromptUpdate }) => {
    const [suggestions, setSuggestions] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [testInput, setTestInput] = useState('');
    const [testResponse, setTestResponse] = useState('');
    const [apiConfigured, setApiConfigured] = useState(false);
    const [activeTab, setActiveTab] = useState('suggestions');

    useEffect(() => {
        checkApiStatus();
    }, []);

    const checkApiStatus = async () => {
        try {
            const status = await aiService.getApiStatus();
            setApiConfigured(status.configured);
        } catch (error) {
            console.error('Error checking API status:', error);
            setApiConfigured(false);
        }
    };

    const getSuggestions = async () => {
        if (!currentPrompt || currentPrompt.trim().length < 10) {
            alert('Please enter a prompt with at least 10 characters to get suggestions.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await aiService.getSuggestions(currentPrompt);
            setSuggestions(result.suggestions);
        } catch (error) {
            console.error('Error getting suggestions:', error);
            alert('Failed to get suggestions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const testPrompt = async () => {
        if (!currentPrompt || currentPrompt.trim().length < 5) {
            alert('Please enter a prompt to test.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await aiService.testPrompt(currentPrompt, testInput);
            setTestResponse(result.response);
        } catch (error) {
            console.error('Error testing prompt:', error);
            alert('Failed to test prompt. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const generateAlternative = async (improvement) => {
        if (!currentPrompt || currentPrompt.trim().length < 5) {
            alert('Please enter a prompt to improve.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await aiService.generateAlternative(currentPrompt, improvement);
            if (onPromptUpdate) {
                onPromptUpdate(result.alternative);
            }
        } catch (error) {
            console.error('Error generating alternative:', error);
            alert('Failed to generate alternative. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const quickImprovements = [
        "Make it more specific and detailed",
        "Add examples of desired output",
        "Specify the tone and style",
        "Include context and constraints",
        "Break it into smaller steps"
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Assistant
                </h3>
                <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${apiConfigured ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm text-gray-600">
                        {apiConfigured ? 'API Connected' : 'Demo Mode'}
                    </span>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('suggestions')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'suggestions'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Suggestions
                </button>
                <button
                    onClick={() => setActiveTab('testing')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'testing'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Test Prompt
                </button>
                <button
                    onClick={() => setActiveTab('improve')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'improve'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Quick Improve
                </button>
            </div>

            {/* Suggestions Tab */}
            {activeTab === 'suggestions' && (
                <div>
                    <div className="mb-4">
                        <button
                            onClick={getSuggestions}
                            disabled={isLoading || !currentPrompt}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            )}
                            Get AI Suggestions
                        </button>
                    </div>

                    {suggestions && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-800 mb-2">AI Suggestions:</h4>
                            <div className="text-blue-700 whitespace-pre-wrap">{suggestions}</div>
                        </div>
                    )}
                </div>
            )}

            {/* Testing Tab */}
            {activeTab === 'testing' && (
                <div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Test Input (Optional):
                        </label>
                        <textarea
                            value={testInput}
                            onChange={(e) => setTestInput(e.target.value)}
                            placeholder="Enter test input to see how your prompt performs..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="3"
                        />
                    </div>

                    <div className="mb-4">
                        <button
                            onClick={testPrompt}
                            disabled={isLoading || !currentPrompt}
                            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            Test Prompt
                        </button>
                    </div>

                    {testResponse && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium text-green-800 mb-2">AI Response:</h4>
                            <div className="text-green-700 whitespace-pre-wrap">{testResponse}</div>
                        </div>
                    )}
                </div>
            )}

            {/* Quick Improve Tab */}
            {activeTab === 'improve' && (
                <div>
                    <div className="mb-4">
                        <h4 className="font-medium text-gray-800 mb-3">Quick Improvements:</h4>
                        <div className="grid gap-2">
                            {quickImprovements.map((improvement, index) => (
                                <button
                                    key={index}
                                    onClick={() => generateAlternative(improvement)}
                                    disabled={isLoading || !currentPrompt}
                                    className="text-left p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <div className="font-medium text-gray-800">{improvement}</div>
                                    <div className="text-sm text-gray-600 mt-1">Click to apply this improvement</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center py-4">
                            <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="ml-2 text-gray-600">Generating improved prompt...</span>
                        </div>
                    )}
                </div>
            )}

            {!apiConfigured && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div className="text-sm text-yellow-800">
                            <strong>Demo Mode:</strong> OpenAI API is not configured. You're seeing mock responses for demonstration purposes.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAssistant; 