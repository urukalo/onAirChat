import React, { useState, useEffect, useRef } from 'react';
import { Send, Calendar, Bell, User, Search } from 'lucide-react';

const OnAirChat = () => {
  // eslint-disable-next-line
  const [events, setEvents] = useState([
    { id: 1, name: 'Champions League: Barcelona vs. Munich', category: 'Sports', time: '20:45', date: 'Today', active: true },
    { id: 2, name: 'Taylor Swift Concert: Paris', category: 'Music', time: '21:00', date: 'Today', active: true },
    { id: 3, name: 'Global Tech Summit 2025', category: 'Technology', time: '09:00', date: 'Tomorrow', active: false },
    { id: 4, name: 'NBA Finals Game 3', category: 'Sports', time: '19:30', date: 'Tomorrow', active: false }
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const messagesEndRef = useRef(null);

  // Initial demo messages for selected event
  useEffect(() => {
    if (selectedEvent) {
      const demoMessages = [
        { id: 1, user: 'Maria', text: 'So excited for this event!', time: '20:46', avatar: '/api/placeholder/32/32' },
        { id: 2, user: 'Alex', text: 'Anyone here from Berlin?', time: '20:48', avatar: '/api/placeholder/32/32' },
        { id: 3, user: 'John', text: 'What a start! Incredible performance.', time: '20:52', avatar: '/api/placeholder/32/32' }
      ];
      setMessages(demoMessages);
    }
  }, [selectedEvent]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedEvent) {
      const newMessage = {
        id: messages.length + 1,
        user: 'You',
        text: messageInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: '/api/placeholder/32/32'
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && event.active) || 
                         (filter === 'upcoming' && !event.active);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">onAirChat</h1>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full hover:bg-blue-500">
              <Bell size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-blue-500">
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Events sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                className="w-full py-2 pl-8 pr-4 text-sm border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-2 text-gray-400" size={16} />
            </div>
            <div className="flex mt-2 text-sm">
              <button 
                className={`flex-1 py-1 ${filter === 'all' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`flex-1 py-1 ${filter === 'active' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                onClick={() => setFilter('active')}
              >
                Live
              </button>
              <button 
                className={`flex-1 py-1 ${filter === 'upcoming' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                onClick={() => setFilter('upcoming')}
              >
                Upcoming
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredEvents.map(event => (
              <div 
                key={event.id} 
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-blue-50 ${selectedEvent && selectedEvent.id === event.id ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${event.active ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                    {event.active ? 'LIVE' : event.date}
                  </span>
                  <span className="text-xs text-gray-500">{event.time}</span>
                </div>
                <h3 className="mt-1 font-medium">{event.name}</h3>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <Calendar size={12} className="mr-1" />
                  <span>{event.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedEvent ? (
            <>
              {/* Event info */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{selectedEvent.name}</h2>
                    <p className="text-sm text-gray-500">{selectedEvent.category} • {selectedEvent.active ? 'Live now' : selectedEvent.date + ' - ' + selectedEvent.time}</p>
                  </div>
                  {selectedEvent.active && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded animate-pulse">
                      LIVE
                    </span>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.map(message => (
                  <div key={message.id} className="flex mb-4">
                    <img src={message.avatar} alt={message.user} className="w-8 h-8 rounded-full mr-2" />
                    <div className="bg-white p-3 rounded-lg shadow-sm max-w-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{message.user}</span>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 p-2 outline-none"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button 
                    className="bg-blue-600 text-white p-2 px-4"
                    onClick={handleSendMessage}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium">Select an event</h3>
                <p className="mt-1">Choose an event from the list to join the conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnAirChat;
