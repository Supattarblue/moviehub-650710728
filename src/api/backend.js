// ชั้นกลางสำหรับคุยกับ Backend ของทีมเรา
const BASE = process.env.REACT_APP_API_URL || '';

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json()
    .catch(() => ({ error: 'server ไม่ได้ตอบเป็น JSON' }));

  if (!res.ok) {
    let errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
    if (typeof data === 'string') {
      errorMessage = data;
    } else if (data && typeof data === 'object') {
      errorMessage = data.message || data.error || data.msg || JSON.stringify(data);
    }
    throw new Error(errorMessage);
  }

  return data;
}

// ---------- สมาชิก ----------
export function register(email, password, displayName) {
  return apiFetch('/api/auth/register', { 
    method: 'POST', 
    body: { 
      email, 
      password, 
      displayName,
      name: displayName,          // เผื่อ Backend Go รับ 'name'
      display_name: displayName   // เผื่อ Backend Go รับ 'display_name'
    } 
  });
}

export function login(email, password) {
  return apiFetch('/api/auth/login', { method: 'POST', body: { email, password } });
}

export function getMe(token) {
  return apiFetch('/api/me', { token });
}

// ---------- รีวิว ----------
export function getReviews(movieId) {
  return apiFetch(`/api/movies/${movieId}/reviews`);
}

export function postReview(movieId, text, token) {
  return apiFetch(`/api/movies/${movieId}/reviews`, { method: 'POST', body: { text }, token });
}

// ---------- คะแนน ----------
export function putVote(movieId, score, token) {
  return apiFetch(`/api/movies/${movieId}/vote`, { method: 'PUT', body: { score }, token });
}

// ---------- Wishlist ----------
export function getWishlist(token) {
  return apiFetch('/api/me/wishlist', { token });
}

export function addToWishlist(movieId, token) {
  return apiFetch(`/api/me/wishlist/${movieId}`, { method: 'PUT', token });
}

export function removeFromWishlist(movieId, token) {
  return apiFetch(`/api/me/wishlist/${movieId}`, { method: 'DELETE', token });
}

// ---------- หนัง ----------
export async function getMovies() {
  const data = await apiFetch('/api/movies');
  return data.items;
}

export async function getMovie(movieId) {
  const items = await getMovies();
  const movie = items.find(m => String(m.id) === String(movieId));
  if (!movie) {
    const err = new Error('ไม่พบหนังเรื่องนี้');
    err.status = 404;
    throw err;
  }
  return movie;
}