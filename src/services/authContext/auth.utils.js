export const ROLES = {
  REQUESTER: 0,
  MODERATOR: 1,
  ADMIN: 2,
};

export function decodeToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const ROLE_KEYS = [
  "role",
  "roles",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role",
];

const ROLE_NAME_MAP = {
  requester: ROLES.REQUESTER,
  moderator: ROLES.MODERATOR,
  admin: ROLES.ADMIN,
};

function parseRole(value) {
  if (value == null) return null;
  const num = Number(value);
  if (!Number.isNaN(num)) return num;
  const mapped = ROLE_NAME_MAP[String(value).toLowerCase()];
  return mapped !== undefined ? mapped : null;
}

export function getRoleFromToken(token) {
  const payload = decodeToken(token);
  if (!payload) return null;

  for (const key of ROLE_KEYS) {
    if (payload[key] !== undefined) return parseRole(payload[key]);
  }

  for (const [key, value] of Object.entries(payload)) {
    if (ROLE_KEYS.includes(key.toLowerCase())) {
      return parseRole(value);
    }
  }

  return null;
}
