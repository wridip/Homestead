import React, { useState, useEffect } from 'react';
import { getEarningsAudit } from '../../services/hostService';

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
    return <div className="text-center p-8">Loading audit data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  const sortedMonths = auditData ? Object.keys(auditData).sort((a, b) => new Date(b) - new Date(a)) : [];

  return (
    <div className="p-8 bg-background rounded-2xl shadow-lg backdrop-blur-sm border border-border">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
        Earnings Audit
      </h1>
      <div className="space-y-4">
        {sortedMonths.length > 0 ? (
          sortedMonths.map((monthYear) => (
            <div key={monthYear} className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => toggleMonth(monthYear)}
                className="w-full flex justify-between items-center p-4 bg-muted/20 hover:bg-accent transition-colors"
              >
                <span className="text-lg font-semibold text-foreground">{monthYear}</span>
                <div className="flex items-center gap-4">
                   <span className="text-lg font-bold text-green-500">
                    ₹{auditData[monthYear].totalEarnings.toFixed(2)}
                  </span>
                  <svg
                    className={`w-6 h-6 text-muted-foreground transition-transform ${openMonth === monthYear ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </button>
              {openMonth === monthYear && (
                <div className="p-4 border-t border-border bg-card">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Property</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Traveler</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Dates</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Earning</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {auditData[monthYear].bookings.map((booking) => (
                          <tr key={booking._id} className="hover:bg-accent/30 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{booking.propertyId?.name || 'Deleted Property'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{booking.travelerId?.name || 'Deleted User'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-500">₹{booking.totalPrice.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">No completed bookings found to generate an audit.</p>
        )}
      </div>
    </div>
  );
};

export default EarningsAudit;
