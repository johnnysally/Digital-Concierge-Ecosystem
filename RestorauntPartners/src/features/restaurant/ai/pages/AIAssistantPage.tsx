import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { askAIAssistant } from '../../ai/services/aiService';

export default function AIAssistantPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const mutation = useMutation({
    mutationFn: (queryText: string) => askAIAssistant(queryText),
    onSuccess: (data) => {
      setResponse(data.response ?? 'No response received.');
      setErrorMessage('');
    },
    onError: (error) => {
      console.error('AI assistant request failed', error);
      setErrorMessage('Unable to fetch AI response. Please try again.');
    },
  });

  const handleSendRequest = async () => {
    if (!query.trim()) return;

    setResponse('');
    setErrorMessage('');

    try {
      await mutation.mutateAsync(query.trim());
    } catch {
      // handled in onError
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">AI Business Assistant</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Ask for demand predictions, pricing guidance, and menu recommendations.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          rows={4}
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          placeholder="Ask the AI assistant for pricing, demand forecasting, or menu strategy"
        />
        <button
          type="button"
          onClick={handleSendRequest}
          disabled={mutation.isLoading || !query.trim()}
          className="mt-4 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
        >
          {mutation.isLoading ? 'Sending…' : 'Send Request'}
        </button>
      </div>

      {errorMessage ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {errorMessage}
        </div>
      ) : null}

      {response ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">AI Response</h3>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{response}</p>
        </div>
      ) : null}
    </div>
  );
}
