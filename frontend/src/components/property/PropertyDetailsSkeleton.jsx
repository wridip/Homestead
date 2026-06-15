import React from 'react';

const PropertyDetailsSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6 space-y-4">
        <div className="h-10 bg-muted rounded-md w-1/3" />
        <div className="flex justify-between items-center">
          <div className="h-5 bg-muted rounded-md w-1/2" />
          <div className="flex gap-4">
            <div className="h-10 bg-muted rounded-full w-24" />
            <div className="h-10 bg-muted rounded-full w-24" />
          </div>
        </div>
      </div>

      {/* Gallery Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 md:grid-rows-2 gap-2 h-[300px] md:h-[500px] mb-16 rounded-[2rem] overflow-hidden">
        <div className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 bg-muted" />
        <div className="hidden md:block col-span-1 row-span-1 bg-muted" />
        <div className="hidden md:block col-span-1 row-span-1 bg-muted" />
        <div className="hidden md:block col-span-1 row-span-1 bg-muted" />
        <div className="hidden md:block col-span-1 row-span-1 bg-muted" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          {/* Info Sections */}
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded-md w-1/4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded-md w-full" />
              <div className="h-4 bg-muted rounded-md w-full" />
              <div className="h-4 bg-muted rounded-md w-3/4" />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded-md w-1/4" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-6 w-6 bg-muted rounded-full" />
                  <div className="h-6 bg-muted rounded-md w-1/2" />
                </div>
              ))}
            </div>
          </div>

          {/* Host Section Skeleton */}
          <div className="p-8 border border-border rounded-3xl space-y-6">
            <div className="h-8 bg-muted rounded-md w-1/4" />
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-muted rounded-full" />
              <div className="space-y-3 flex-1">
                <div className="h-6 bg-muted rounded-md w-1/3" />
                <div className="h-4 bg-muted rounded-md w-1/4" />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Card Skeleton */}
        <div className="h-[450px] bg-muted rounded-3xl sticky top-24" />
      </div>
    </div>
  );
};

export default PropertyDetailsSkeleton;
