import React from 'react';

const Profile = () => {
  return (
    <div className="p-8 bg-card/50 rounded-2xl shadow-lg backdrop-blur-sm border border-border">
      <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
      <p className="mt-2 text-muted-foreground">Update your personal information.</p>
      {/* Profile form will go here */}
    </div>
  );
};

export default Profile;