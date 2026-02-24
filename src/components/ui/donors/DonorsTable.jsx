import { useState, useMemo, useContext } from 'react';
import './donors.css';
import DonorForm from './DonorForm';
import DeleteConfirm from './DeleteConfirm';
import { donors as initial } from '../../../data/donors';
import AuthContext from '../../../services/authContext/AuthContext';
import { ROLES } from '../../../services/authContext/auth.utils';

const DonorsTable = () => {
  const { isAuthenticated, role } = useContext(AuthContext);
  const isAdmin = isAuthenticated && role === ROLES.ADMIN;
  const [donors, setDonors] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
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

  const handleEdit = (donor) => {
    setEditing(donor);
    setShowForm(true);
  };

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = (id) => {
    const donor = donors.find((x) => x.id === id);
    setDeleteTarget(donor);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDonors((d) => d.filter((x) => x.id !== deleteTarget.id));
    setShowDelete(false);
    setDeleteTarget(null);
  };

  const handleSave = (donor) => {
    setDonors((d) => d.map((x) => (x.id === donor.id ? donor : x)));
    setShowForm(false);
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
            <th>ID</th>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('name')}>
              Name{sortIndicator('name')}
            </th>
            <th>Email</th>
            <th>Phone</th>
            <th>Blood</th>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('lastDonation')}>
              Last Donation{sortIndicator('lastDonation')}
            </th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((d) => (
            <tr key={d.id} className={d.isActive ? '' : 'muted'}>
              <td data-label="ID">{d.id}</td>
              <td data-label="Name">{d.name}</td>
              <td data-label="Email">{d.email}</td>
              <td data-label="Phone">{d.phone}</td>
              <td data-label="Blood">{d.bloodType}</td>
              <td data-label="Last Donation">{d.lastDonation}</td>
              <td data-label="Active">{d.isActive ? 'Yes' : 'No'}</td>
              <td>
                <button className="btn small" onClick={() => handleEdit(d)}>
                  Edit
                </button>
                {isAdmin && (
                  <button className="btn small danger" onClick={() => handleDelete(d.id)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <DonorForm
          initial={editing}
          visible={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      <DeleteConfirm
        visible={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        itemName={deleteTarget ? deleteTarget.name : 'this donor'}
      />
    </div>
  );
};

export default DonorsTable;
