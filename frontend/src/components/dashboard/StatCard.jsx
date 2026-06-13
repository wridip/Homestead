import React from 'react';

const StatCard = ({ title, value, change, icon }) => (
  <div className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
      {icon}
    </div>
    <div className="flex items-center justify-between relative z-10">
      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">{title}</p>
      <div className="text-primary bg-primary/10 p-2.5 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
        {icon}
      </div>
    </div>
    <div className="mt-6 flex items-end justify-between relative z-10">
      <div className="space-y-1">
        <p className="text-3xl font-black tracking-tighter text-foreground font-serif italic">
          {value}
        </p>
        {change && (
          <p className={`text-[11px] font-bold tracking-tight ${
            change.includes('+') ? 'text-emerald-500' : 'text-red-400'
          }`}>
            {change}
          </p>
        )}
      </div>
    </div>
  </div>
);

export default StatCard;
