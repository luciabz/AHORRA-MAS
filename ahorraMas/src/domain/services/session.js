// MOVIDO desde src/shared/utils/session.js
export function getTokenPayload(token) {
  if (!token) return null;
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function getTokenExpiration(token) {
  const payload = getTokenPayload(token);
  if (!payload) return null;
  // exp en segundos, iat en segundos
  return payload.exp || (payload.iat ? payload.iat + 3600 : null);
}

export function isTokenExpired(token) {
  const exp = getTokenExpiration(token);
  if (!exp) return true;
  const now = Date.now() / 1000;
  return now > exp;
}

export function scheduleTokenLogout(token, onExpire) {
  const exp = getTokenExpiration(token);
  if (!exp) return;
  const now = Date.now() / 1000;
  const ms = (exp - now) * 1000;
  if (ms > 0) {
    return setTimeout(onExpire, ms);
  } else {
    onExpire();
  }
}
