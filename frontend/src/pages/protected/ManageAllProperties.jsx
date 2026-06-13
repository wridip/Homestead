import React, { useState, useEffect, useMemo } from 'react';
import { getAllProperties } from '../../services/adminService';
import { getImageUrl } from '../../services/api';
import moment from 'moment';
import { motion } from 'framer-motion';

const ManageAllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getAllProperties();
        setProperties(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      const matchesSearch = prop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           prop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prop.hostId?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'All' || prop.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [properties, searchTerm, typeFilter]);

  const inventoryStats = useMemo(() => ({
    total: properties.length,
    active: properties.filter(p => p.status === 'Active').length,
    types: [...new Set(properties.map(p => p.type))].length
  }), [properties]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-3xl">
      <p className="text-red-500 font-bold">Error loading properties: {error}</p>
    </div>
  );

  return (
    <div className="p-8 space-y-10 max-w-[1600px] mx-auto">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground tracking-tight font-serif italic">Global Inventory</h1>
          <p className="text-muted-foreground max-w-md">Comprehensive oversight of all platform listings. Moderate content and track performance.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {[
            { label: 'Listings', value: inventoryStats.total },
            { label: 'Live Now', value: inventoryStats.active },
            { label: 'Categories', value: inventoryStats.types }
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border px-8 py-4 rounded-2xl shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-foreground tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-card/50 backdrop-blur-sm border border-border p-4 rounded-[2rem] flex flex-col md:flex-row gap-4 items-center shadow-lg">
        <div className="relative flex-1 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          <input 
            type="text" 
            placeholder="Search by property name, location, or host identity..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-background/50 border border-border rounded-2xl text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
          />
        </div>
        <div className="flex bg-muted/50 p-1.5 rounded-2xl border border-border shrink-0 overflow-x-auto max-w-full">
          {['All', 'Mountain', 'Riverside', 'Farm'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                typeFilter === type ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] border-b border-border">
                <th className="px-8 py-6">Property Overview</th>
                <th className="px-8 py-6">Ownership</th>
                <th className="px-8 py-6">Economics</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProperties.map((prop, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={prop._id} 
                  className="group hover:bg-muted/10 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="relative shrink-0">
                        <img 
                          src={prop.images?.length > 0 ? getImageUrl(prop.images[0]) : 'https://via.placeholder.com/200'} 
                          alt={prop.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-border shadow-sm group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute -top-2 -right-2 bg-background border border-border px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter shadow-sm">
                          {prop.type}
                        </div>
                      </div>
                      <div className="max-w-[250px]">
                        <div className="font-bold text-foreground text-base tracking-tight truncate">{prop.name}</div>
                        <div className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          <span className="truncate">{prop.address}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-[10px] font-black text-primary border border-primary/10">
                        {prop.hostId?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground leading-tight">{prop.hostId?.name}</div>
                        <div className="text-[10px] text-muted-foreground font-medium">{prop.hostId?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-black text-primary text-lg tracking-tighter font-serif italic">
                      ₹{prop.baseRate.toLocaleString()}
                      <span className="text-[10px] text-muted-foreground ml-1 uppercase font-sans tracking-widest not-italic">/night</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      prop.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      <span className={`w-1 h-1 rounded-full bg-current ${prop.status === 'Active' ? 'animate-pulse' : ''}`}></span>
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2.5 rounded-xl bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm group/btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:scale-110 transition-transform"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                      <button className="p-2.5 rounded-xl bg-background border border-border text-muted-foreground hover:text-red-400 hover:border-red-400 transition-all shadow-sm group/btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:rotate-12 transition-transform"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><path d="m14.5 9-5 5"></path><path d="m9.5 9 5 5"></path></svg>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProperties.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">No assets detected in this sector</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAllProperties;