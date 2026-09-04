export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

export async function get(path) {
  return request(path);
}

export async function post(path, body) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function put(path, body) {
  return request(path, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function del(path) {
  await request(path, { method: 'DELETE' });
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const message = await readError(res);
    throw new Error(message || 'Erro ao comunicar com a API');
  }

  const contentType = res.headers.get('content-type') || '';
  if (res.status === 204 || !contentType.includes('application/json')) return null;

  return res.json();
}

async function readError(res) {
  try {
    const data = await res.json();
    return data.message || data.error || data.detail;
  } catch {
    return res.statusText;
  }
}
