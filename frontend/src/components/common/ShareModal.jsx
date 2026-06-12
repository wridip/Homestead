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
      <div className="bg-card p-6 rounded-2xl shadow-lg border border-border w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold text-foreground mb-4">Share this photo</h3>
        <div className="flex flex-col space-y-3">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center py-2 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
            className="w-full py-2 px-4 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            Copy Link
          </button>
        </div>
        <button onClick={onClose} className="mt-4 w-full py-2 px-4 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
