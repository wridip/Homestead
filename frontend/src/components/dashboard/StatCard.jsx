import React from 'react';

const StatCard = ({ title, value, change, icon }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/[0.06] transition">
    <div className="flex items-center justify-between">
      <p className="text-[12px] text-neutral-400">{title}</p>
      {icon}
    </div>
    <div className="mt-2 flex items-end gap-2">
      <p className="text-2xl font-semibold tracking-tight text-white">
        {value}
      </p>
      {change && <span className="text-[12px] text-emerald-400">{change}</span>}
    </div>
  </div>
);

export default StatCard;
