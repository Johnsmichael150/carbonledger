'use client';

import { useState } from 'react';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { useIsMobile } from '@/hooks/useMediaQuery';

// Mock data - replace with your actual data
const listings = [
  { id: 1, project: 'Solar Farm', amount: '100', price: '$25', location: 'California' },
  { id: 2, project: 'Wind Energy', amount: '250', price: '$22', location: 'Texas' },
  { id: 3, project: 'Forest Conservation', amount: '500', price: '$30', location: 'Brazil' },
];

export default function MarketplacePage() {
  const isMobile = useIsMobile();

  const columns = [
    { key: 'project', header: 'Project' },
    { key: 'amount', header: 'Amount (tons)' },
    { key: 'price', header: 'Price' },
    { key: 'location', header: 'Location' },
  ];

  if (isMobile) {
    return (
      <div className="container" style={{ padding: '16px' }}>
        <h1 className="text-center" style={{ fontSize: '24px', marginBottom: '20px' }}>
          Carbon Marketplace
        </h1>
        
        <div className="mobile-card-container">
          {listings.map((item) => (
            <div key={item.id} className="mobile-card">
              <div className="mobile-card-title">{item.project}</div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Amount (tons)</span>
                <span className="mobile-card-value">{item.amount}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Price</span>
                <span className="mobile-card-value">{item.price}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">Location</span>
                <span className="mobile-card-value">{item.location}</span>
              </div>
              <button
                style={{
                  width: '100%',
                  marginTop: '12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  minHeight: '44px',
                  cursor: 'pointer'
                }}
              >
                Purchase
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>Carbon Marketplace</h1>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Amount (tons)</th>
              <th>Price</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((item) => (
              <tr key={item.id}>
                <td>{item.project}</td>
                <td>{item.amount}</td>
                <td>{item.price}</td>
                <td>{item.location}</td>
                <td>
                  <button style={{ padding: '8px 16px', minHeight: '44px' }}>
                    Purchase
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
