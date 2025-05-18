import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import NewChatModal from './NewChatModal';
import SideBar from '../sidebar/sidebar';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch all chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('http://localhost:5000/chats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des conversations');
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  // Fetch messages for active chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;

      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get(`http://localhost:5000/chats/${activeChat.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const chatMessages = response.data.Messages || response.data.messages || [];
        // Transform messages to include sender information and map contenu to content
        const formattedMessages = chatMessages.map(msg => ({
          ...msg,
          content: msg.contenu, // Map contenu to content for display
          isCurrentUser: msg.senderId === Number(localStorage.getItem('userId'))
        }));
        setMessages(formattedMessages);
        scrollToBottom();
      } catch (err) {
        setError('Erreur lors du chargement des messages');
      }
    };

    fetchMessages();
  }, [activeChat]);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Send message handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.post(
        'http://localhost:5000/messages',
        { 
          contenu: messageInput,
          senderId: Number(localStorage.getItem('userId')),
          chatId: activeChat.id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Format the new message for display
      const newMessage = {
        ...response.data,
        content: response.data.contenu,
        isCurrentUser: true
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');
      scrollToBottom();

      // Update chat list after sending message
      const chatsResponse = await axios.get('http://localhost:5000/chats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(chatsResponse.data);
    } catch (err) {
      setError('Erreur lors de l\'envoi du message');
    }
  };

  // Create new chat handler
  const handleCreateChat = async (userId) => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.post(
        'http://localhost:5000/chats',
        { participantId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChats(prev => [...prev, response.data]);
      setActiveChat(response.data);
      setShowNewChatModal(false);
    } catch (err) {
      setError('Erreur lors de la création de la conversation');
    }
  };
  // Poll for new messages in active chat
  useEffect(() => {
    if (!activeChat) return;

    const pollInterval = setInterval(async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get(`http://localhost:5000/chats/${activeChat.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const chatMessages = response.data.Messages || response.data.messages || [];
        if (chatMessages.length !== messages.length) {
          const formattedMessages = chatMessages.map(msg => ({
            ...msg,
            content: msg.contenu,
            isCurrentUser: msg.senderId === Number(localStorage.getItem('userId'))
          }));
          setMessages(formattedMessages);
          scrollToBottom();
        }
      } catch (err) {
        console.error('Error polling messages:', err);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [activeChat, messages.length]);

  // Poll for chat list updates
  useEffect(() => {
    const pollChatsInterval = setInterval(async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('http://localhost:5000/chats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChats(response.data);
      } catch (err) {
        console.error('Error polling chats:', err);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollChatsInterval);
  }, []);

  // Mark messages as read when chat becomes active
  useEffect(() => {
    if (!activeChat) return;

    const markAsRead = async () => {
      try {
        const token = localStorage.getItem('jwt');
        await axios.post(
          `http://localhost:5000/chats/${activeChat.id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setChats(prev => prev.map(chat => 
          chat.id === activeChat.id 
            ? { ...chat, unreadCount: 0 }
            : chat
        ));
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    };

    markAsRead();
  }, [activeChat]);

  if (loading) {
    return (
      <div className="chat-wrapper">
        <SideBar />
        <div className="chat-loading">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-wrapper">
        <SideBar />
        <div className="chat-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="chat-wrapper">
      <SideBar />
      <div className="chat-container">
        <ChatList
          chats={chats}
          activeChat={activeChat}
          onChatSelect={setActiveChat}
          onNewChat={() => setShowNewChatModal(true)}
        />
        
        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            messages={messages}
            messageInput={messageInput}
            onMessageInputChange={setMessageInput}
            onSendMessage={handleSendMessage}
            messagesEndRef={messagesEndRef}
          />
        ) : (
          <div className="chat-empty-state">
            <p>Sélectionnez une conversation ou commencez-en une nouvelle</p>
          </div>
        )}

        {showNewChatModal && (
          <NewChatModal
            onClose={() => setShowNewChatModal(false)}
            onCreateChat={handleCreateChat}
            existingChats={chats}
          />
        )}
      </div>
    </div>
  );
}
