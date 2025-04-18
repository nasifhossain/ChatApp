import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const ChatContext = createContext(null);
const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

function ChatContextProvider({ children }) {
    const [chat, setChat] = useState(null);
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [showLeftBar, setShowLeftBar] = useState(true);
    const [showProfile, setShowProfile] = useState(false);
    const[myFriends,setMyFriends] = useState([]);

    const socket = useRef(null);

    useEffect(() => {
        console.log('Initializing socket connection...');
        socket.current = io(socketUrl, {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ['websocket']
        });

        socket.current.on('connect', () => {
            console.log('Socket connected:', socket.current.id);
            const id = localStorage.getItem('_id');
            if (id) {
                socket.current.emit('addUser', id);
            }
        });

        socket.current.on('getUsers', (users) => {
            console.log('Active Users:', users);
        });

        socket.current.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socket.current.on('connect_error', (err) => {
            console.error('Connection error:', err);
        });

        return () => {
            console.log('Cleaning up socket...');
            socket.current?.off('connect');
            socket.current?.off('getUsers');
            socket.current?.off('disconnect');
            socket.current?.off('connect_error');
            socket.current?.disconnect();
        };
    }, []);

    return (
        <ChatContext.Provider value={{
            chat, setChat,
            user, setUser,
            messages, setMessages,
            showChat, setShowChat,
            showLeftBar, setShowLeftBar,
            showProfile, setShowProfile,
            myFriends, setMyFriends,
            socket: socket.current // Expose socket instance directly
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export default ChatContextProvider;
