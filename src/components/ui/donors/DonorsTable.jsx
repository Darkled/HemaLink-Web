import { useState, useMemo, useEffect } from 'react';
import './donors.css';
import { getRequesters } from './donors.services.js';

const DonorsTable = () => {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    async function fetchDonors() {
      try {
        const apiDonors = await getRequesters();

        setDonors(apiDonors);
      } catch (err) {
        console.error('Error fetching donors:', err);
      }
    }
    fetchDonors();
  }, []);

  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortIndicator = (key) => {
    if (sortKey !== key) return ' \u2195';
    return sortDir === 'asc' ? ' \u2191' : ' \u2193';
  };

  const sorted = useMemo(() => {
    const copy = [...donors];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'lastDonation') {
        cmp = new Date(a.lastDonation) - new Date(b.lastDonation);
      } else {
        const valA = (a[sortKey] || '').toString().toLowerCase();
        const valB = (b[sortKey] || '').toString().toLowerCase();
        cmp = valA.localeCompare(valB);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [donors, sortKey, sortDir]);

  return (
    <div className="donors-container">
      <table className="donors-table">
        <thead>
          <tr>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('name')}>
              Name{sortIndicator('name')}
            </th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((d, idx) => (
            <tr key={d.id || idx}>
              <td data-label="Name">{d.name || d.Name}</td>
              <td data-label="Email">{d.email || d.Email}</td>
              <td data-label="Phone">{d.phone || d.Phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonorsTable;
