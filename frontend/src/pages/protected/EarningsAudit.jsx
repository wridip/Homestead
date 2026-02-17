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
    <div className="p-8 bg-neutral-900/50 rounded-2xl shadow-lg backdrop-blur-sm border border-neutral-800">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
        Earnings Audit
      </h1>
      <div className="space-y-4">
        {sortedMonths.length > 0 ? (
          sortedMonths.map((monthYear) => (
            <div key={monthYear} className="bg-[#1E1E1E] border border-neutral-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleMonth(monthYear)}
                className="w-full flex justify-between items-center p-4 bg-neutral-900/50 hover:bg-neutral-800 transition-colors"
              >
                <span className="text-lg font-semibold text-neutral-200">{monthYear}</span>
                <div className="flex items-center gap-4">
                   <span className="text-lg font-bold text-green-400">
                    ₹{auditData[monthYear].totalEarnings.toFixed(2)}
                  </span>
                  <svg
                    className={`w-6 h-6 text-neutral-400 transition-transform ${openMonth === monthYear ? 'transform rotate-180' : ''}`}
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
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-700">
                      <thead className="bg-neutral-800/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Property</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Traveler</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Dates</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">Earning</th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#1E1E1E] divide-y divide-neutral-700">
                        {auditData[monthYear].bookings.map((booking) => (
                          <tr key={booking._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-200">{booking.propertyId.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{booking.travelerId.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-400">₹{booking.totalPrice.toFixed(2)}</td>
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
          <p className="text-neutral-400 text-center py-8">No completed bookings found to generate an audit.</p>
        )}
      </div>
    </div>
  );
};

export default EarningsAudit;
