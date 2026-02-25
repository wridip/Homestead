import React, { useState, useEffect } from 'react';
import { getInbox, getOutbox, getMessageById, deleteMessage, sendMessage } from '../../services/messageService';
import moment from 'moment';

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [view, setView] = useState('inbox'); // 'inbox' or 'sent'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

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
    try {
      const response = await getMessageById(id);
      setSelectedMessage(response.data);
      setReplyContent('');
      setReplySuccess(false);
      // Update the message in the list to be read
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
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete message');
      }
    }
  };

  if (loading && messages.length === 0) return <div className="text-white p-8">Loading messages...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <div className="flex bg-neutral-800 rounded-lg p-1">
          <button
            onClick={() => { setView('inbox'); setSelectedMessage(null); }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'inbox' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            Inbox
          </button>
          <button
            onClick={() => { setView('sent'); setSelectedMessage(null); }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'sent' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            Sent
          </button>
        </div>
      </div>

      {error && <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded mb-4">{error}</div>}

      <div className="flex-1 flex overflow-hidden bg-neutral-900 rounded-xl border border-neutral-800 min-h-[500px]">
        {/* Message List */}
        <div className="w-1/3 border-r border-neutral-800 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">No {view} messages yet.</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => handleSelectMessage(msg._id)}
                className={`p-4 border-b border-neutral-800 cursor-pointer hover:bg-neutral-800 transition-colors ${
                  selectedMessage?._id === msg._id ? 'bg-neutral-800' : ''
                } ${view === 'inbox' && !msg.read ? 'border-l-4 border-l-blue-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-medium ${view === 'inbox' && !msg.read ? 'text-white' : 'text-neutral-300'}`}>
                    {view === 'inbox' ? msg.sender.name : msg.receiver.name}
                  </h3>
                  <span className="text-xs text-neutral-500">
                    {moment(msg.createdAt).format('MMM D')}
                  </span>
                </div>
                <p className="text-sm text-neutral-400 truncate">{msg.subject || 'No Subject'}</p>
                <p className="text-xs text-neutral-500 mt-1 truncate">{msg.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-900">
          {selectedMessage ? (
            <div>
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-neutral-800">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{selectedMessage.subject || 'No Subject'}</h2>
                  <div className="text-sm text-neutral-400">
                    {view === 'inbox' ? 'From: ' : 'To: '}
                    <span className="text-blue-400 font-medium">
                      {view === 'inbox' ? selectedMessage.sender.name : selectedMessage.receiver.name}
                    </span> 
                    {' '}
                    ({view === 'inbox' ? selectedMessage.sender.email : selectedMessage.receiver.email})
                  </div>
                  {selectedMessage.property && (
                    <div className="text-sm text-neutral-500 mt-1">
                      Regarding: <span className="text-neutral-300 italic">{selectedMessage.property.name}</span>
                    </div>
                  )}
                  <div className="text-xs text-neutral-500 mt-1">
                    {moment(selectedMessage.createdAt).format('MMMM D, YYYY h:mm A')}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteMessage(selectedMessage._id, e)}
                  className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm rounded border border-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>
              <div className="text-neutral-300 whitespace-pre-wrap leading-relaxed">
                {selectedMessage.content}
              </div>

              {/* Reply Form */}
              <div className="mt-12 pt-8 border-t border-neutral-800">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {view === 'inbox' ? 'Reply to Message' : 'Send another message'}
                </h3>
                <form onSubmit={handleSendReply} className="space-y-4">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none min-h-[150px]"
                  />
                  {replySuccess && <p className="text-green-500 text-sm">Message sent successfully!</p>}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!replyContent.trim() || sendingReply}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                    >
                      {sendingReply ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-neutral-500 italic">
              Select a message to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
