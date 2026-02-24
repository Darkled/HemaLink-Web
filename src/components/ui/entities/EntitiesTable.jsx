import React, { useState, useEffect, useMemo, useContext } from 'react';
import '../donors/donors.css';
import EntityForm from './EntityForm';
import DeleteConfirm from '../donors/DeleteConfirm';
import { getRequesters, getPendingRequesters, formatAdmissionStatus, acceptRequester, rejectRequester } from './entities.services';
import AuthContext from '../../../services/authContext/AuthContext';
import { ROLES } from '../../../services/authContext/auth.utils';

const EntitiesTable = () => {
  const { isAuthenticated, role } = useContext(AuthContext);
  const isAdmin = isAuthenticated && role === ROLES.ADMIN;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [filter, setFilter] = useState('all'); // 'all' | 'pending'

  const fetchData = (selectedFilter) => {
    setLoading(true);
    const fetcher = selectedFilter === 'pending' ? getPendingRequesters : getRequesters;
    fetcher()
      .then((data) => { setItems(data); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleAccept = async (id) => {
    try {
      await acceptRequester(id);
      fetchData(filter);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequester(id);
      fetchData(filter);
    } catch (err) {
      setError(err.message);
    }
  };

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

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const handleEdit = (item) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const it = items.find((x) => x.id === id);
    setDeleteTarget(it);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setItems((d) => d.filter((x) => x.id !== deleteTarget.id));
    setShowDelete(false);
    setDeleteTarget(null);
  };

  const handleSave = (entity) => {
    setItems((d) => d.map((x) => (x.id === entity.id ? entity : x)));
    setShowForm(false);
  };

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      const valA = (a[sortKey] || '').toString().toLowerCase();
      const valB = (b[sortKey] || '').toString().toLowerCase();
      const cmp = valA.localeCompare(valB);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [items, sortKey, sortDir]);

  if (loading) return <p>Loading entities...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="donors-container">
      <div className="donors-toolbar">
        <div className="toolbar-left">
          <label className="sort-label">Filter:</label>
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">All Entities</option>
            <option value="pending">Pending Approval</option>
          </select>
        </div>
      </div>

      <table className="donors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('name')}>
              Name{sortIndicator('name')}
            </th>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('email')}>
              Email{sortIndicator('email')}
            </th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((e) => (
            <tr key={e.id}>
              <td data-label="ID">{e.id}</td>
              <td data-label="Name">{e.name}</td>
              <td data-label="Email">{e.email}</td>
              <td data-label="Status">{formatAdmissionStatus(e.admissionStatus)}</td>
              <td>
                {e.admissionStatus === 0 && (
                  <>
                    <button className="btn small primary" onClick={() => handleAccept(e.id)}>
                      Approve
                    </button>
                    <button className="btn small danger" onClick={() => handleReject(e.id)}>
                      Reject
                    </button>
                  </>
                )}
                <button className="btn small" onClick={() => handleEdit(e)}>
                  Edit
                </button>
                {isAdmin && (
                  <button className="btn small danger" onClick={() => handleDelete(e.id)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <EntityForm initial={editing} visible={showForm} onClose={() => setShowForm(false)} onSave={handleSave} />
      )}

      <DeleteConfirm visible={showDelete} onClose={() => setShowDelete(false)} onConfirm={confirmDelete} itemName={deleteTarget ? deleteTarget.name : 'this entity'} />
    </div>
  );
};

export default EntitiesTable;
