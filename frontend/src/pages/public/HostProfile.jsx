import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserProfile } from '../../services/userService';
import { sendMessage } from '../../services/messageService';
import AuthContext from '../../context/AuthContext';
import moment from 'moment';

const HostProfile = () => {
  const { id } = useParams();
  const { isAuthenticated, user: currentUser } = useContext(AuthContext);
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState(null);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchHost = async () => {
      try {
        const response = await getUserProfile(id);
        setHost(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load host profile');
      } finally {
        setLoading(false);
      }
    };
    fetchHost();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      return setMessageError('You must be logged in to send a message.');
    }
    if (currentUser.role !== 'Traveler') {
      return setMessageError('Only travelers can send messages to hosts.');
    }
    if (!message.trim()) {
      return setMessageError('Please enter a message.');
    }

    setSending(true);
    try {
      await sendMessage({
        receiverId: host._id,
        subject: `Query from traveler ${currentUser.name}`,
        content: message,
      });
      setMessageSuccess(true);
      setMessage('');
      setMessageError(null);
    } catch (err) {
      setMessageError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="pt-24 min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center text-xl">Loading...</div>;
  if (error) return <div className="pt-24 min-h-screen bg-[#0F0F0F] text-red-500 flex items-center justify-center text-xl">{error}</div>;
  if (!host) return <div className="pt-24 min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center text-xl">Host not found</div>;

  return (
    <div className="pt-24 min-h-screen bg-[#0F0F0F] text-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sticky top-32 shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <img
                  src={host.avatar ? `http://localhost:5000/uploads/${host.avatar}` : 'https://via.placeholder.com/150'}
                  alt={host.name}
                  className="w-48 h-48 rounded-full object-cover border-4 border-neutral-800 shadow-xl mb-6"
                />
                <h1 className="text-3xl font-bold mb-1">{host.name}</h1>
                <p className="text-blue-400 font-medium mb-4">{host.role}</p>
                <div className="w-full h-px bg-neutral-800 mb-6"></div>
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 text-neutral-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span>Joined {moment(host.createdAt).format('MMMM YYYY')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    <span>Identity Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio and Messaging */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 italic">About {host.name.split(' ')[0]}</h2>
              <div className="text-neutral-300 text-lg leading-relaxed whitespace-pre-wrap italic">
                {host.bio || "This host hasn't added a bio yet. They're probably busy making their homestead perfect for your visit!"}
              </div>
            </div>

            <div className="h-px bg-neutral-800 w-full"></div>

            <div id="message-section">
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Hi ${host.name}, I have a question about your homestead...`}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-4 text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none min-h-[200px]"
                    />
                  </div>
                  {messageError && (
                    <p className="text-red-500 text-sm">{messageError}</p>
                  )}
                  {messageSuccess && (
                    <p className="text-green-500 text-sm">Message sent successfully!</p>
                  )}
                  <button
                    type="submit"
                    disabled={!message.trim() || sending}
                    className="w-full sm:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/20"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostProfile;
