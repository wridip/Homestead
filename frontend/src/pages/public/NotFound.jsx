import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-card/50 rounded-2xl shadow-lg backdrop-blur-sm border border-border">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="text-2xl mt-4 text-muted-foreground">Page Not Found</p>
      <p className="mt-2 text-muted-foreground">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;