import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import '../donors/donors.css';
import ModeratorForm from './ModeratorForm';
import PromoteConfirm from './PromoteConfirm';
import DeleteConfirm from '../donors/DeleteConfirm';
import AuthContext from '../../../services/authContext/AuthContext';
import { ROLES } from '../../../services/authContext/auth.utils';
import {
  getModerators,
  getAdmins,
  createModerator,
  deleteModerator,
  promoteModerator,
} from './moderators.services';

const ModeratorsTable = () => {
  const { isAuthenticated, role } = useContext(AuthContext);
  const isAdmin = isAuthenticated && role === ROLES.ADMIN;
  const [moderators, setModerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortKey, setSortKey] = useState('type');
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
    if (sortKey !== key) return ' ↕';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  const sortedModerators = useMemo(() => {
    const list = [...moderators];
    list.sort((a, b) => {
      const valA = (a[sortKey] || '').toLowerCase();
      const valB = (b[sortKey] || '').toLowerCase();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [moderators, sortKey, sortDir]);

  const [showForm, setShowForm] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const [promoteTarget, setPromoteTarget] = useState(null);
  const [showPromote, setShowPromote] = useState(false);

  const fetchModerators = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [modsData, adminsData] = await Promise.all([
        getModerators(),
        getAdmins(),
      ]);
      const mods = (Array.isArray(modsData) ? modsData : []).map((m) => ({ ...m, type: 'Moderator' }));
      const admins = (Array.isArray(adminsData) ? adminsData : []).map((a) => ({ ...a, type: 'Admin' }));
      setModerators([...admins, ...mods]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModerators();
  }, [fetchModerators]);

  const handleAdd = () => setShowForm(true);

  const handleSave = async (form) => {
    try {
      await createModerator(form);
      setShowForm(false);
      fetchModerators();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = (mod) => {
    setDeleteTarget(mod);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteModerator(deleteTarget.id);
      setShowDelete(false);
      setDeleteTarget(null);
      fetchModerators();
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePromote = (mod) => {
    setPromoteTarget(mod);
    setShowPromote(true);
  };

  const confirmPromote = async () => {
    if (!promoteTarget) return;
    try {
      await promoteModerator(promoteTarget.email);
      setShowPromote(false);
      setPromoteTarget(null);
      fetchModerators();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="mx-4">Loading moderators and admins…</p>;
  if (error) return <p className="mx-4 text-danger">Error: {error}</p>;

  return (
    <div className="donors-container">
      <div className="donors-toolbar">
        <div className="toolbar-left" />
        <div className="toolbar-right">
          <button className="btn primary" onClick={handleAdd}>
            + Add Moderator
          </button>
        </div>
      </div>

      <table className="donors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('name')}>
              Name{sortIndicator('name')}
            </th>
            <th>Email</th>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('type')}>
              Type{sortIndicator('type')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedModerators.map((m) => (
            <tr key={`${m.type}-${m.id}`} style={{ height: '49px' }}>
              <td data-label="ID">{m.id}</td>
              <td data-label="Name">{m.name}</td>
              <td data-label="Email">{m.email}</td>
              <td data-label="Type">{m.type}</td>
              <td>
                {m.type === 'Moderator' && (
                  <button className="btn small" onClick={() => handlePromote(m)}>
                    Promote
                  </button>
                )}
                {isAdmin && m.type === 'Moderator' && (
                  <button className="btn small danger" onClick={() => handleDelete(m)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
          {sortedModerators.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No moderators or admins found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <ModeratorForm
          visible={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      <DeleteConfirm
        visible={showDelete}
        onClose={() => {
          setShowDelete(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        itemName={deleteTarget ? deleteTarget.name : 'this moderator'}
      />

      <PromoteConfirm
        visible={showPromote}
        onClose={() => {
          setShowPromote(false);
          setPromoteTarget(null);
        }}
        onConfirm={confirmPromote}
        moderatorName={promoteTarget ? promoteTarget.name : 'this moderator'}
      />
    </div>
  );
};

export default ModeratorsTable;
