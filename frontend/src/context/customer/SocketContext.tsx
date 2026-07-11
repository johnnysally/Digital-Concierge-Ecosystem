import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

interface SocketContextState {
    socket: Socket | null;
    connected: boolean;
}

const SocketContext = createContext<SocketContextState | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { user, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const s = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
        });

        s.on('connect', () => {
            setConnected(true);
            s.emit('join', user._id);
        });

        s.on('disconnect', () => setConnected(false));

        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, [isAuthenticated, user]);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error('useSocket must be used within SocketProvider');
    return context;
};