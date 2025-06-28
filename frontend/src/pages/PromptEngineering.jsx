import React, { useState, useEffect } from 'react';
import { exampleUsageService } from '../services/exampleUsageService';

export const EXAMPLES = [
  {
    label: 'Summarize Article',
    prompt: 'Summarize the following article in 3 bullet points: [paste article here]',
    response: '• Key point 1\n• Key point 2\n• Key point 3',
  },
  {
    label: 'Translate to French',
    prompt: "Translate the following text to French: 'Hello, how are you?'",
    response: 'Bonjour, comment ça va ?',
  },
  {
    label: 'Helpful Assistant',
    prompt: 'Act as a helpful assistant. When I ask a question, provide a concise and accurate answer.',
    response: 'Of course! Please ask your question.',
  },
  {
    label: 'Extract Entities',
    prompt: 'Extract all person names from the following text: [paste text here]',
    response: '• John Doe\n• Jane Smith',
  },
  {
    label: 'Classify Sentiment',
    prompt: 'Classify the sentiment of this review as Positive, Negative, or Neutral: [paste review here]',
    response: 'Sentiment: Positive',
  },
  {
    label: 'Creative Story',
    prompt: 'Write a short story about a robot who learns to paint.',
    response: 'Once upon a time, there was a robot named Artie who discovered a passion for painting... (etc.)',
  },
  {
    label: 'Generate Code',
    prompt: 'Write a Python function that checks if a number is prime.',
    response: 'def is_prime(n):\n    if n <= 1:\n        return False\n    for i in range(2, int(n**0.5)+1):\n        if n % i == 0:\n            return False\n    return True',
  },
];

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'examples', label: 'Interactive Examples' },
  { id: 'resources', label: 'Resources' },
];

const CollapsibleSection = ({ id, title, children, open, setOpen, defaultOpen = false }) => {
  const isOpen = open === undefined ? defaultOpen : open;
  return (
    <section id={id} className="mb-6">
      <button
        className="w-full flex justify-between items-center text-left text-xl font-semibold text-gray-800 py-2 px-2 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none"
        onClick={() => setOpen && setOpen(isOpen ? null : id)}
        aria-expanded={isOpen}
      >
        {title}
        <span className="ml-2">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="mt-2 px-2">{children}</div>}
    </section>
  );
};

// Usage tracking helpers
const USAGE_KEY = 'prompt_example_usage';
function incrementExampleUsage(idx) {
  const usage = JSON.parse(localStorage.getItem(USAGE_KEY) || '{}');
  usage[idx] = (usage[idx] || 0) + 1;
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}
export function getExampleUsageStats() {
  const usage = JSON.parse(localStorage.getItem(USAGE_KEY) || '{}');
  return usage;
}

const PromptEngineering = () => {
  const [selected, setSelected] = useState(0);
  const [input, setInput] = useState(EXAMPLES[0].prompt);
  const [output, setOutput] = useState('');
  const [openSection, setOpenSection] = useState('overview');

  // Open section based on hash on mount and when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (sections.some(sec => sec.id === hash)) {
        setOpenSection(hash);
      }
    };
    handleHashChange(); // Run on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleExampleChange = (e) => {
    const idx = e.target.value;
    setSelected(idx);
    setInput(EXAMPLES[idx].prompt);
    setOutput('');
  };

  const handleRun = async () => {
    setOutput(EXAMPLES[selected].response);
    try {
      await exampleUsageService.incrementUsage(selected);
    } catch (error) {
      console.error('Failed to track usage:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto mt-8">
      {/* Sidebar/Table of Contents */}
      <nav className="md:w-64 mb-4 md:mb-0">
        <div className="bg-white rounded-lg shadow p-4 sticky top-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Contents</h2>
          <ul className="space-y-2">
            {sections.map(sec => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className="text-indigo-700 hover:underline block"
                  onClick={() => setOpenSection(sec.id)}
                >
                  {sec.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {/* Main Content */}
      <div className="flex-1">
        <CollapsibleSection id="overview" title="Overview" open={openSection === 'overview'} setOpen={setOpenSection} defaultOpen>
          <p className="text-gray-700 mb-2">
            <b>Prompt Engineering</b> is the art and science of crafting effective inputs (prompts) to guide large language models (LLMs) like ChatGPT, GPT-4, and others to produce desired outputs. Well-designed prompts can significantly improve the quality, relevance, and safety of AI-generated responses.
          </p>
        </CollapsibleSection>
        <CollapsibleSection id="concepts" title="Prompt Engineering Concepts" open={openSection === 'concepts'} setOpen={setOpenSection} defaultOpen>
          <div className="flex flex-col items-center mb-2">
            <svg width="320" height="120" viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="40" width="80" height="40" rx="8" fill="#6366f1" />
              <text x="50" y="65" textAnchor="middle" fill="white" fontSize="16">Prompt</text>
              <polygon points="90,60 110,60 110,65 90,65" fill="#6366f1" />
              <rect x="110" y="30" width="100" height="60" rx="12" fill="#a5b4fc" />
              <text x="160" y="65" textAnchor="middle" fill="#312e81" fontSize="16">LLM</text>
              <polygon points="210,60 230,60 230,65 210,65" fill="#6366f1" />
              <rect x="230" y="40" width="80" height="40" rx="8" fill="#22d3ee" />
              <text x="270" y="65" textAnchor="middle" fill="#0e7490" fontSize="16">Output</text>
            </svg>
            <span className="text-gray-500 text-sm mt-2">A prompt is sent to a language model (LLM), which generates an output based on the input and its training.</span>
          </div>
        </CollapsibleSection>
        <CollapsibleSection id="best-practices" title="Best Practices" open={openSection === 'best-practices'} setOpen={setOpenSection}>
          <ul className="list-disc pl-6 text-gray-700 mb-2">
            <li>Be clear and specific about your instructions.</li>
            <li>Provide context or examples when possible.</li>
            <li>Break complex tasks into smaller steps.</li>
            <li>Use delimiters (quotes, triple backticks) to separate instructions from data.</li>
            <li>Iterate and refine prompts based on model output.</li>
          </ul>
        </CollapsibleSection>
        <CollapsibleSection id="examples" title="Interactive Examples" open={openSection === 'examples'} setOpen={setOpenSection}>
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Choose an example:</label>
            <select
              className="w-full p-2 border rounded mb-4"
              value={selected}
              onChange={handleExampleChange}
            >
              {EXAMPLES.map((ex, idx) => (
                <option value={idx} key={ex.label}>{ex.label}</option>
              ))}
            </select>
            <textarea
              className="w-full p-2 border rounded font-mono text-sm mb-2"
              rows={3}
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              onClick={handleRun}
            >
              Run Example
            </button>
          </div>
          {output && (
            <div className="bg-gray-100 rounded p-4 mb-4">
              <div className="font-mono text-sm text-gray-800 whitespace-pre-line">{output}</div>
            </div>
          )}
        </CollapsibleSection>
        <CollapsibleSection id="resources" title="Resources" open={openSection === 'resources'} setOpen={setOpenSection}>
          <ul className="list-disc pl-6 text-blue-700">
            <li><a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Prompt Engineering Guide</a></li>
            <li><a href="https://www.promptingguide.ai/" target="_blank" rel="noopener noreferrer" className="underline">The Prompt Engineering Guide</a></li>
          </ul>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default PromptEngineering; 