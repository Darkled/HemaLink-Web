import React, { useState, useMemo, useContext } from "react";
import '../donors/donors.css';
import DeleteConfirm from '../donors/DeleteConfirm';
import { campaigns as initial } from "../../../data/campaigns";
import AuthContext from "../../../services/authContext/AuthContext";
import { ROLES } from "../../../services/authContext/auth.utils";

const CampaignsTable = () => {
  const { isAuthenticated, role } = useContext(AuthContext);
  const isAdmin = isAuthenticated && role === ROLES.ADMIN;
  const [campaigns, setCampaigns] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

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

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (campaign) => {
    setEditing(campaign);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const campaign = campaigns.find((x) => x.id === id);
    setDeleteTarget(campaign);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setCampaigns((c) => c.filter((x) => x.id !== deleteTarget.id));
    setShowDelete(false);
    setDeleteTarget(null);
  };

  const handleSave = (campaign) => {
    if (campaign.id) {
      setCampaigns((c) => c.map((x) => (x.id === campaign.id ? campaign : x)));
    } else {
      const nextId = campaigns.length ? Math.max(...campaigns.map((c) => c.id)) + 1 : 1;
      setCampaigns((c) => [...c, { ...campaign, id: nextId }]);
    }
    setShowForm(false);
  };

  const sorted = useMemo(() => {
    const copy = [...campaigns];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') {
        cmp = new Date(a.date) - new Date(b.date);
      } else {
        const valA = (a[sortKey] || '').toString().toLowerCase();
        const valB = (b[sortKey] || '').toString().toLowerCase();
        cmp = valA.localeCompare(valB);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [campaigns, sortKey, sortDir]);

  return (
    <div className="donors-container">
      <div className="donors-toolbar">
        <div className="toolbar-left" />
        <div className="toolbar-right">
          <button className="btn primary" onClick={handleAdd}>
            + Add Campaign
          </button>
        </div>
      </div>
      <table className="donors-table">
        <thead>
          <tr>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('entityName')}>
              Entity{sortIndicator('entityName')}
            </th>
            <th>Blood Type</th>
            <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort('date')}>
              Date{sortIndicator('date')}
            </th>
            <th>Location</th>
            <th>Units</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => (
            <tr key={c.id}>
              <td data-label="Entity">{c.entityName}</td>
              <td data-label="Blood Type">{c.bloodType}</td>
              <td data-label="Date">{c.date}</td>
              <td data-label="Location">{c.location}</td>
              <td data-label="Units">{c.units}</td>
              <td data-label="Status">{c.status}</td>
              <td>
                <button className="btn small" onClick={() => handleEdit(c)}>
                  Edit
                </button>
                {isAdmin && (
                  <button className="btn small danger" onClick={() => handleDelete(c.id)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteConfirm
        visible={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        itemName={deleteTarget ? deleteTarget.entityName : 'this campaign'}
      />
    </div>
  );
};

export default CampaignsTable;
