const API = import.meta.env.VITE_API_URL;

export const cancelAppointment = async (requestId, token) => {
  const url = `${API}/api/Donor/appointment/cancel/${requestId}?cancellationToken=${encodeURIComponent(token)}`;
  
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Error al cancelar: ${res.status}`);
  }

  return res.json().catch(() => ({}));
};