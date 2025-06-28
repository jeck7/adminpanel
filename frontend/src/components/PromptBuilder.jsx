import React, { useState, useEffect } from 'react';
import AIAssistant from './AIAssistant';

const PromptBuilder = ({ onSave, initialPrompt = '' }) => {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [variables, setVariables] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [preview, setPreview] = useState('');
    const [showAI, setShowAI] = useState(false);

    const templates = [
        {
            id: 'email',
            name: 'Email Template',
            template: 'Write a professional email to {recipient} regarding {subject}. The tone should be {tone}.',
            variables: ['recipient', 'subject', 'tone']
        },
        {
            id: 'content',
            name: 'Content Creation',
            template: 'Create a {contentType} about {topic} for {audience}. The style should be {style} and length should be {length}.',
            variables: ['contentType', 'topic', 'audience', 'style', 'length']
        },
        {
            id: 'analysis',
            name: 'Data Analysis',
            template: 'Analyze the following {dataType} data and provide insights about {focus}. Include {requirements} in your response.',
            variables: ['dataType', 'focus', 'requirements']
        },
        {
            id: 'creative',
            name: 'Creative Writing',
            template: 'Write a {genre} story about {theme} with {character} as the main character. The setting should be {setting}.',
            variables: ['genre', 'theme', 'character', 'setting']
        },
        {
            id: 'custom',
            name: 'Custom Template',
            template: '',
            variables: []
        }
    ];

    useEffect(() => {
        updatePreview();
    }, [prompt, variables]);

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template.id);
        setPrompt(template.template);
        setVariables(template.variables.map(v => ({ name: v, value: '' })));
    };

    const updatePreview = () => {
        let previewText = prompt;
        variables.forEach(variable => {
            const placeholder = `{${variable.name}}`;
            const value = variable.value || `[${variable.name}]`;
            previewText = previewText.replace(new RegExp(placeholder, 'g'), value);
        });
        setPreview(previewText);
    };

    const addVariable = () => {
        const newVar = { name: `variable${variables.length + 1}`, value: '' };
        setVariables([...variables, newVar]);
    };

    const updateVariable = (index, field, value) => {
        const updatedVars = [...variables];
        updatedVars[index][field] = value;
        setVariables(updatedVars);
    };

    const removeVariable = (index) => {
        setVariables(variables.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (onSave) {
            onSave({
                prompt: prompt,
                variables: variables,
                preview: preview
            });
        }
    };

    const handlePromptUpdate = (newPrompt) => {
        setPrompt(newPrompt);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Prompt Builder</h2>
                <button
                    onClick={() => setShowAI(!showAI)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    {showAI ? 'Hide AI' : 'Show AI'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Builder */}
                <div className="space-y-6">
                    {/* Template Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Choose Template:
                        </label>
                        <select
                            value={selectedTemplate}
                            onChange={(e) => handleTemplateSelect(templates.find(t => t.id === e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a template...</option>
                            {templates.map(template => (
                                <option key={template.id} value={template.id}>
                                    {template.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Prompt Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prompt Template:
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter your prompt template. Use {variable} for placeholders..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="6"
                        />
                    </div>

                    {/* Variables */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Variables:
                            </label>
                            <button
                                onClick={addVariable}
                                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                            >
                                + Add Variable
                            </button>
                        </div>
                        <div className="space-y-2">
                            {variables.map((variable, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={variable.name}
                                        onChange={(e) => updateVariable(index, 'name', e.target.value)}
                                        placeholder="Variable name"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                    <input
                                        type="text"
                                        value={variable.value}
                                        onChange={(e) => updateVariable(index, 'value', e.target.value)}
                                        placeholder="Default value (optional)"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                    <button
                                        onClick={() => removeVariable(index)}
                                        className="text-red-500 hover:text-red-600 p-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                        Save Prompt
                    </button>
                </div>

                {/* Right Column - Preview and AI */}
                <div className="space-y-6">
                    {/* Preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preview:
                        </label>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[200px]">
                            <div className="text-gray-800 whitespace-pre-wrap">{preview || 'Preview will appear here...'}</div>
                        </div>
                    </div>

                    {/* AI Assistant */}
                    {showAI && (
                        <AIAssistant 
                            currentPrompt={prompt} 
                            onPromptUpdate={handlePromptUpdate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PromptBuilder; 