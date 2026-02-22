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
  const [sortMode, setSortMode] = useState('name-asc');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

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
    if (entity.id) {
      setItems((d) => d.map((x) => (x.id === entity.id ? entity : x)));
    } else {
      const nextId = items.length ? Math.max(...items.map((d) => d.id)) + 1 : 1;
      setItems((d) => [...d, { ...entity, id: nextId }]);
    }
    setShowForm(false);
  };

  const sorted = useMemo(() => {
    const copy = [...items];
    switch (sortMode) {
      case 'name-asc':
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return copy.sort((a, b) => b.name.localeCompare(a.name));
      case 'date-new':
        return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'date-old':
        return copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default:
        return copy;
    }
  }, [items, sortMode]);

  return (
    <div className="donors-container">
      <div className="donors-toolbar">
        <div className="toolbar-left">
          <label className="sort-label">Sort:</label>
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="date-new">Date (new → old)</option>
            <option value="date-old">Date (old → new)</option>
          </select>
        </div>
        <div className="toolbar-right">
          <button className="btn primary" onClick={handleAdd}>
            + Add Entity
          </button>
        </div>
      </div>

      <table className="donors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Contact</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Created</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((e) => (
            <tr key={e.id} className={e.isActive ? '' : 'muted'}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.type}</td>
              <td>{e.contact}</td>
              <td>{e.phone}</td>
              <td>{e.address}</td>
              <td>{e.createdAt}</td>
              <td>{e.isActive ? 'Yes' : 'No'}</td>
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
