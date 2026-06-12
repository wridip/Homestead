import React from 'react';

const StatCard = ({ title, value, change, icon }) => (
  <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-all shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-[12px] text-muted-foreground uppercase tracking-wider font-bold">{title}</p>
      <div className="text-primary bg-primary/10 p-1.5 rounded-lg">
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-end justify-between">
      <p className="text-2xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      {change && <span className={`text-xs font-medium ${change.startsWith('+') ? 'text-emerald-500' : 'text-destructive'}`}>{change}</span>}
    </div>
  </div>
);

export default StatCard;
