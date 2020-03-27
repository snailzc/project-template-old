// use storage the user token
export function getToken() {
  return localStorage.getItem('user-token') || null;
}

export function setToken(token) {
  return localStorage.setItem('user-token', token);
}
