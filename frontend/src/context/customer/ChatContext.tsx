import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Message } from '../../types/customer';
import { getChatHistory, sendMessage as sendChatMessage } from '../../api/customer/chatApi';

interface ChatContextState {
    messages: Message[];
    sendMessage: (message: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextState | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('digitalsafaris_customer');
        if (!stored) return;
        getChatHistory()
            .then((res) => setMessages(res.messages || []))
            .catch(() => setMessages([]));
    }, []);

    const sendMessage = async (message: string) => {
        const userMessage: Message = {
            id: `${Date.now()}`,
            sender: 'customer',
            body: message,
            timestamp: new Date().toISOString(),
        };

        setMessages((current) => [...current, userMessage]);

        try {
            const response = await sendChatMessage({ message });
            const aiMessage: Message = {
                id: `${Date.now()}-ai`,
                sender: 'ai',
                body: response.reply,
                timestamp: new Date().toISOString(),
            };
            setMessages((current) => [...current, aiMessage]);
        } catch {
            // backend message not available yet
        }
    };

    return (
        <ChatContext.Provider value={{ messages, sendMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChatContext must be used within ChatProvider');
    return context;
};