import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export const TOKEN_KEY = 'auth_token';

export const setAuthToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7, secure: true, sameSite: 'strict' });
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};