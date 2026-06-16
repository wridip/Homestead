import React, { useState, useEffect } from 'react';
import { getEarningsAudit } from '../../services/hostService';
import { motion, AnimatePresence } from 'framer-motion';

const EarningsAudit = () => {
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMonth, setOpenMonth] = useState(null);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const response = await getEarningsAudit();
        setAuditData(response.data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchAuditData();
  }, []);

  const toggleMonth = (month) => {
    setOpenMonth(openMonth === month ? null : month);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20">{error}</div>;
  }

  const sortedMonths = auditData ? Object.keys(auditData).sort((a, b) => new Date(b) - new Date(a)) : [];

  return (
    <div className="p-8 space-y-12 max-w-[1600px] mx-auto">
      <header className="space-y-1">
        <h1 className="text-5xl font-black text-foreground tracking-tighter font-serif italic">Earnings Ledger</h1>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Financial History & Performance Audit</p>
      </header>

      <div className="space-y-6">
        {sortedMonths.length > 0 ? (
          sortedMonths.map((monthYear, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={monthYear} 
              className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-xl"
            >
              <button
                onClick={() => toggleMonth(monthYear)}
                className="w-full flex justify-between items-center p-8 hover:bg-muted/10 transition-colors group"
              >
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Fiscal Period</p>
                  <span className="text-2xl font-black text-foreground tracking-tight font-serif italic">{monthYear}</span>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Net Yield</p>
                    <span className="text-2xl font-black text-foreground tracking-tighter">
                      ₹{auditData[monthYear].totalEarnings.toLocaleString()}
                    </span>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl bg-muted flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-primary-foreground ${openMonth === monthYear ? 'rotate-180 bg-primary text-primary-foreground' : ''}`}>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </button>
              
              <AnimatePresence>
                {openMonth === monthYear && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border bg-background/50 overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] border-b border-border">
                              <th className="pb-6 px-4">Property</th>
                              <th className="pb-6 px-4">Traveler</th>
                              <th className="pb-6 px-4 text-center">Duration</th>
                              <th className="pb-6 px-4 text-right">Earning</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {auditData[monthYear].bookings.map((booking) => (
                              <tr key={booking._id} className="group hover:bg-muted/10 transition-colors">
                                <td className="py-6 px-4">
                                  <div className="font-bold text-foreground text-sm tracking-tight">{booking.propertyId?.name || 'Deleted Property'}</div>
                                </td>
                                <td className="py-6 px-4 text-sm text-muted-foreground font-medium">{booking.travelerId?.name || 'Deleted User'}</td>
                                <td className="py-6 px-4 text-center">
                                  <div className="text-xs font-black text-foreground">
                                    {booking.nights + 1} days / {booking.nights} nights
                                  </div>
                                  <div className="text-[10px] text-muted-foreground font-medium">
                                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="py-6 px-4 text-right">
                                  <span className="font-black text-primary text-sm tracking-tighter">₹{booking.totalPrice.toLocaleString()}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className="bg-card border border-border rounded-[2.5rem] p-20 text-center space-y-4">
            <p className="text-muted-foreground font-serif italic text-xl">No completed stays found for financial audit.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsAudit;
