const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const buildHeaders = (config, body) => {
  const headers = { ...(config?.headers || {}) };
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (isFormData) {
    delete headers['Content-Type'];
    delete headers['content-type'];
  } else if (!headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json';
  }

  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const { token } = JSON.parse(userInfo);
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore malformed userInfo
    }
  }
  return headers;
};

const parseBody = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const request = async (method, url, body, config) => {
  const headers = buildHeaders(config, body);
  const init = { method, headers };

  if (body !== undefined && body !== null && method !== 'GET') {
    init.body = (typeof FormData !== 'undefined' && body instanceof FormData)
      ? body
      : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${baseURL}${url}`, init);
  } catch (networkErr) {
    const error = new Error(networkErr.message || 'Network error');
    error.request = init;
    throw error;
  }

  const data = await parseBody(response);

  if (!response.ok) {
    const error = new Error((data && data.message) || response.statusText || 'Request failed');
    error.response = { status: response.status, data };
    throw error;
  }

  return { data, status: response.status };
};

const api = {
  get: (url, config) => request('GET', url, undefined, config),
  post: (url, body, config) => request('POST', url, body, config),
  put: (url, body, config) => request('PUT', url, body, config),
  delete: (url, config) => request('DELETE', url, undefined, config),
};

export default api;
