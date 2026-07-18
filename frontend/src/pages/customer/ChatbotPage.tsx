import React, { useState, useRef, useEffect } from 'react';
import SectionHeader from '../../components/customer/ui/SectionHeader';
import { useChatContext } from '../../context/customer/ChatContext';
import { deleteMessage } from '../../api/customer/chatApi';
import { useTheme } from '../../context/customer/ThemeContext';
import { useAuth } from '../../context/customer/AuthContext';

const ChatbotPage = () => {
    const [message, setMessage] = useState('');
    const { messages, sendMessage } = useChatContext();
    const { isDark } = useTheme();
    const { user } = useAuth();
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!message.trim()) return;
        const msg = message.trim();
        setMessage('');
        setIsTyping(true);
        await sendMessage(msg);
        setIsTyping(false);
    };

    const handleDelete = async (id: string) => {
        await deleteMessage(id);
    };

    const quickPrompts = [
        { text: 'Find hotels in Mombasa', icon: '🏨' },
        { text: 'Order food near me', icon: '🍽️' },
        { text: 'Book a ride', icon: '🚗' },
        { text: 'Check my bookings', icon: '📅' },
    ];

    return (
        <div className="space-y-6 flex h-full min-h-0 flex-col">
            <SectionHeader title="AI Assistant" subtitle="Your intelligent travel assistant — powered by AI" />

            <div className={`flex h-full min-h-0 flex-col rounded-3xl border overflow-hidden shadow-sm ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white shadow-slate-200/70'}`}>
                <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center py-12">
                            <div className="mb-4 text-6xl">🤖</div>
                            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Hello{user?.firstName ? `, ${user.firstName}` : ''}!</h3>
                            <p className={`mx-auto mt-2 max-w-md text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                I'm your Digital Assistant. Ask me about hotels, restaurants, transport, bookings, or anything travel-related.
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {quickPrompts.map((prompt) => (
                                    <button
                                        key={prompt.text}
                                        onClick={() => { setMessage(prompt.text); }}
                                        className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                                    >
                                        {prompt.icon} {prompt.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && (
                                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                    AI
                                </div>
                            )}

                            <div className={`group relative max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                                msg.sender === 'customer'
                                    ? 'bg-sky-600 text-white rounded-br-md'
                                    : isDark ? 'bg-slate-800 text-slate-200 rounded-bl-md' : 'bg-slate-100 text-slate-700 rounded-bl-md'
                            }`}>
                                <p className="whitespace-pre-wrap">{msg.body}</p>
                                <div className="mt-2 flex items-center justify-between gap-4">
                                    <span className={`text-xs ${msg.sender === 'customer' ? 'text-sky-200' : isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                        {msg.sender === 'customer' ? 'You' : 'AI Concierge'} · {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {msg.sender === 'customer' && (
                                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                    {user?.firstName?.[0]?.toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-3 justify-start">
                            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                AI
                            </div>
                            <div className={`rounded-2xl rounded-bl-md px-5 py-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                <div className={`border-t p-4 ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ask anything — hotels, food, rides..."
                            className={`flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${
                                isDark
                                    ? 'border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-sky-500'
                                    : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-500'
                            }`}
                            disabled={isTyping}
                        />
                        <button
                            type="submit"
                            disabled={isTyping || !message.trim()}
                            className="rounded-xl bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white hover:from-sky-400 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-500/25"
                        >
                            {isTyping ? '...' : 'Send'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatbotPage;