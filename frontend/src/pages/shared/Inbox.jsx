import React, { useState, useEffect, useMemo } from 'react';
import { getInbox, getOutbox, getMessageById, deleteMessage, sendMessage } from '../../services/messageService';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [view, setView] = useState('inbox'); // 'inbox' or 'sent'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = view === 'inbox' ? await getInbox() : await getOutbox();
      setMessages(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [view]);

  const handleSelectMessage = async (id) => {
    setSelectedMessageId(id);
    try {
      const response = await getMessageById(id);
      setSelectedMessage(response.data);
      setReplyContent('');
      setReplySuccess(false);
      if (view === 'inbox') {
        setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch message details');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSendingReply(true);
    try {
      const receiverId = view === 'inbox' ? selectedMessage.sender._id : selectedMessage.receiver._id;
      await sendMessage({
        receiverId,
        propertyId: selectedMessage.property?._id,
        subject: `Re: ${selectedMessage.subject || 'Query'}`,
        content: replyContent
      });
      setReplySuccess(true);
      setReplyContent('');
      setTimeout(() => setReplySuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDeleteMessage = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(id);
        setMessages(messages.filter(m => m._id !== id));
        if (selectedMessageId === id) {
          setSelectedMessage(null);
          setSelectedMessageId(null);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete message');
      }
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const name = view === 'inbox' ? msg.sender.name : msg.receiver.name;
      const subject = msg.subject || '';
      const content = msg.content || '';
      const search = searchTerm.toLowerCase();
      return name.toLowerCase().includes(search) || 
             subject.toLowerCase().includes(search) || 
             content.toLowerCase().includes(search);
    });
  }, [messages, searchTerm, view]);

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '?';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Messages</h1>
          <p className="text-muted-foreground text-sm">Communicate with your guests and manage inquiries.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="flex bg-muted p-1 rounded-xl border border-border shadow-sm">
            <button
              onClick={() => { setView('inbox'); setSelectedMessage(null); setSelectedMessageId(null); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === 'inbox' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Inbox
            </button>
            <button
              onClick={() => { setView('sent'); setSelectedMessage(null); setSelectedMessageId(null); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === 'sent' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Sent
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden bg-card rounded-2xl border border-border shadow-xl relative">
        {/* Message List */}
        <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-border transition-all ${selectedMessageId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-border bg-muted/30">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {view === 'inbox' ? 'Recent Inquiries' : 'Your Outbox'}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="space-y-4 p-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse flex gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path><path d="M2 7h20v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z"></path></svg>
                </div>
                <p className="text-muted-foreground font-medium">No messages found</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => handleSelectMessage(msg._id)}
                  className={`p-4 border-b border-border cursor-pointer transition-all relative hover:bg-muted/50 ${
                    selectedMessageId === msg._id ? 'bg-primary/5' : ''
                  }`}
                >
                  {selectedMessageId === msg._id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  )}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0 border border-primary/20">
                      {getInitials(view === 'inbox' ? msg.sender.name : msg.receiver.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h3 className={`text-sm font-bold truncate ${view === 'inbox' && !msg.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {view === 'inbox' ? msg.sender.name : msg.receiver.name}
                        </h3>
                        <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap ml-2">
                          {moment(msg.createdAt).format('MMM D')}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${view === 'inbox' && !msg.read ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                        {msg.subject || 'No Subject'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {msg.content}
                      </p>
                    </div>
                    {view === 'inbox' && !msg.read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 self-start"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex-1 flex flex-col bg-background overflow-hidden transition-all ${!selectedMessageId ? 'hidden md:flex' : 'flex'}`}>
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div 
                key={selectedMessage._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full"
              >
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-center bg-card">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedMessageId(null)} className="md:hidden p-2 -ml-2 hover:bg-muted rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">
                      {getInitials(view === 'inbox' ? selectedMessage.sender.name : selectedMessage.receiver.name)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground leading-tight">
                        {view === 'inbox' ? selectedMessage.sender.name : selectedMessage.receiver.name}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {view === 'inbox' ? selectedMessage.sender.email : selectedMessage.receiver.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDeleteMessage(selectedMessage._id, e)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      title="Delete Conversation"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-[10px] font-bold uppercase tracking-wider">Subject</span>
                      <h3 className="text-lg font-bold text-foreground">{selectedMessage.subject || 'No Subject'}</h3>
                    </div>
                    
                    {selectedMessage.property && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-xl mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span className="text-xs font-semibold text-primary">Regarding: {selectedMessage.property.name}</span>
                      </div>
                    )}

                    <div className="bg-muted/30 rounded-2xl p-6 border border-border">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{view === 'inbox' ? 'Original Inquiry' : 'Sent Message'}</span>
                        <span className="text-[10px] text-muted-foreground">{moment(selectedMessage.createdAt).format('MMMM D, YYYY [at] h:mm A')}</span>
                      </div>
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm italic">
                        "{selectedMessage.content}"
                      </p>
                    </div>
                  </div>

                  {/* Reply Section */}
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px bg-border flex-1"></div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Reply</span>
                      <div className="h-px bg-border flex-1"></div>
                    </div>
                    
                    <form onSubmit={handleSendReply} className="space-y-4">
                      <div className="relative group">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Compose your reply..."
                          className="w-full bg-card border border-border rounded-2xl p-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none min-h-[150px] shadow-inner"
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                          {replySuccess && (
                            <motion.span 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-xs font-bold text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              Sent!
                            </motion.span>
                          )}
                          <button
                            type="submit"
                            disabled={!replyContent.trim() || sendingReply}
                            className="p-2 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 hover:scale-105 transition-all shadow-lg shadow-primary/30"
                          >
                            {sendingReply ? (
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/20">
                <div className="w-20 h-20 bg-card rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-border">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40"><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path><path d="M2 7h20v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Select a conversation</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Choose a message from the sidebar to view the full conversation and reply.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
