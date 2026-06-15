import React from 'react';

const PropertyCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm animate-pulse">
      <div className="aspect-[4/3] bg-muted w-full" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start gap-3">
          <div className="h-5 bg-muted rounded-md w-2/3" />
          <div className="h-4 bg-muted rounded-md w-10" />
        </div>
        <div className="h-3 bg-muted rounded-md w-full" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-muted rounded-md w-1/4" />
          <div className="h-4 bg-muted rounded-md w-1/6" />
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
