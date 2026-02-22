import { useState, useEffect, useCallback, useContext } from 'react';
import '../donors/donors.css';
import ModeratorForm from './ModeratorForm';
import PromoteConfirm from './PromoteConfirm';
import DeleteConfirm from '../donors/DeleteConfirm';
import AuthContext from '../../../services/authContext/AuthContext';
import { ROLES } from '../../../services/authContext/auth.utils';
import {
  getModerators,
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

  const [showForm, setShowForm] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const [promoteTarget, setPromoteTarget] = useState(null);
  const [showPromote, setShowPromote] = useState(false);

  const fetchModerators = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getModerators();
      setModerators(Array.isArray(data) ? data : []);
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

  if (loading) return <p className="mx-4">Loading moderators…</p>;
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
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {moderators.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>
                <button className="btn small" onClick={() => handlePromote(m)}>
                  Promote
                </button>
                {isAdmin && (
                  <button className="btn small danger" onClick={() => handleDelete(m)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
          {moderators.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                No moderators found.
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
