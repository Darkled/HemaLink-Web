const API = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = window.localStorage.getItem("hemalink-token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const ADMISSION_STATUS = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
};

export const formatAdmissionStatus = (status) => ADMISSION_STATUS[status] ?? `Unknown (${status})`;

export const getRequesters = async () => {
  const res = await fetch(`${API}/api/Moderator/requesters`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch entities (${res.status})`);
  const json = await res.json();
  return json.data ?? json;
};

export const getPendingRequesters = async () => {
  const res = await fetch(`${API}/api/Moderator/pending-requesters`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch pending entities (${res.status})`);
  const json = await res.json();
  return json.data ?? json;
};

export const acceptRequester = async (id) => {
  const res = await fetch(`${API}/api/Moderator/accept?id=${id}`, {
    method: 'PUT',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to accept entity (${res.status})`);
  return res;
};

export const rejectRequester = async (id) => {
  const res = await fetch(`${API}/api/Moderator/reject?id=${id}`, {
    method: 'PUT',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to reject entity (${res.status})`);
  return res;
};
