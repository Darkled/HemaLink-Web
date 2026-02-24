import React, { useState, useMemo, useContext } from 'react';
import '../donors/donors.css';
import EntityForm from './EntityForm';
import DeleteConfirm from '../donors/DeleteConfirm';
import { entities as initial } from '../../../data/entities';
import AuthContext from '../../../services/authContext/AuthContext';
import { ROLES } from '../../../services/authContext/auth.utils';

const EntitiesTable = () => {
  const { isAuthenticated, role } = useContext(AuthContext);
  const isAdmin = isAuthenticated && role === ROLES.ADMIN;
  const [items, setItems] = useState(initial);
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
      let cmp = 0;
      if (sortKey === 'createdAt') {
        cmp = new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        const valA = (a[sortKey] || '').toString().toLowerCase();
        const valB = (b[sortKey] || '').toString().toLowerCase();
        cmp = valA.localeCompare(valB);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [items, sortKey, sortDir]);

  return (
    <div className="donors-container">
      <table className="donors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('name')}>
              Name{sortIndicator('name')}
            </th>
            <th>Type</th>
            <th>Contact</th>
            <th>Phone</th>
            <th>Address</th>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('createdAt')}>
              Created{sortIndicator('createdAt')}
            </th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((e) => (
            <tr key={e.id} className={e.isActive ? '' : 'muted'}>
              <td data-label="ID">{e.id}</td>
              <td data-label="Name">{e.name}</td>
              <td data-label="Type">{e.type}</td>
              <td data-label="Contact">{e.contact}</td>
              <td data-label="Phone">{e.phone}</td>
              <td data-label="Address">{e.address}</td>
              <td data-label="Created">{e.createdAt}</td>
              <td data-label="Active">{e.isActive ? 'Yes' : 'No'}</td>
              <td>
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
