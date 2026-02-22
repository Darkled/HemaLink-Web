import React, { useState, useMemo } from "react";
import { campaigns as initial } from "../../../data/campaigns";

const CampaignsTable = () => {
  const [campaigns, setCampaigns] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [sortMode, setSortMode] = useState("date-desc");

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
    switch (sortMode) {
      case "date-desc":
        return copy.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "date-asc":
        return copy.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "name-asc":
        return copy.sort((a, b) => a.entityName.localeCompare(b.entityName));
      case "name-desc":
        return copy.sort((a, b) => b.entityName.localeCompare(a.entityName));
      default:
        return copy;
    }
  }, [campaigns, sortMode]);

  return (
    <div className="campaigns-table-container">
      <div className="campaigns-toolbar">
        <div className="toolbar-left">
          <label className="sort-label">Sort:</label>
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
            <option value="date-desc">Date (new → old)</option>
            <option value="date-asc">Date (old → new)</option>
            <option value="name-asc">Entity A-Z</option>
            <option value="name-desc">Entity Z-A</option>
          </select>
        </div>
        <div className="toolbar-right">
          <button className="btn primary" onClick={handleAdd}>
            + Add Campaign
          </button>
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Entity</th>
            <th>Blood Type</th>
            <th>Date</th>
            <th>Location</th>
            <th>Units</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => (
            <tr key={c.id}>
              <td>{c.entityName}</td>
              <td>{c.bloodType}</td>
              <td>{c.date}</td>
              <td>{c.location}</td>
              <td>{c.units}</td>
              <td>{c.status}</td>
              <td>
                <button className="btn btn-sm btn-secondary me-2" onClick={() => handleEdit(c)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignsTable;
