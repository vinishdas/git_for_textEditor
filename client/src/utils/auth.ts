export const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export const isTokenValid = (token: string): boolean => {
  const payload = decodeToken(token)
  if (!payload || !payload.exp) return false
  return Date.now() < payload.exp * 1000
}
