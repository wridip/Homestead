import React from 'react';

const ShareModal = ({ url, text, onClose }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
      onClose();
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-[#1E1E1E] p-6 rounded-2xl shadow-lg border border-neutral-700 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold text-neutral-200 mb-4">Share this photo</h3>
        <div className="flex flex-col space-y-3">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Share on Facebook
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center py-2 px-4 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Share on WhatsApp
          </a>
          <button
            onClick={copyToClipboard}
            className="w-full py-2 px-4 rounded-lg bg-neutral-600 text-white hover:bg-neutral-700 transition-colors"
          >
            Copy Link
          </button>
        </div>
        <button onClick={onClose} className="mt-4 w-full py-2 px-4 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
