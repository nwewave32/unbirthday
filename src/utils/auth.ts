import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

export const generatePageUUID = (): string => {
  return uuidv4();
};

export const createEditPageURL = (uuid: string, token?: string): string => {
  const baseUrl = `/edit/${uuid}`;
  return token ? `${baseUrl}?token=${token}` : baseUrl;
};

export const parseEditPageURL = (pathname: string, search: string) => {
  const uuidMatch = pathname.match(/^\/edit\/([a-f0-9-]{36})$/);
  const uuid = uuidMatch ? uuidMatch[1] : null;

  const searchParams = new URLSearchParams(search);
  const token = searchParams.get('token');

  return { uuid, token };
};

const COOKIE_NAME = 'edit_page_access_token';
const TOKEN_LENGTH = 32;

export const generateToken = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const storeToken = (uuid: string, token: string): void => {
  const isProduction = import.meta.env.PROD;
  const tokenData = { uuid, token, createdAt: Date.now() };

  Cookies.set(COOKIE_NAME, JSON.stringify(tokenData), {
    expires: 1,
    secure: isProduction,
    sameSite: 'strict',
    path: '/'
  });
};

export const getStoredToken = (uuid: string): string | null => {
  try {
    const cookieValue = Cookies.get(COOKIE_NAME);
    if (!cookieValue) return null;

    const tokenData = JSON.parse(cookieValue);
    if (tokenData.uuid === uuid) {
      return tokenData.token;
    }
    return null;
  } catch (error) {
    console.error('Error parsing token from cookie:', error);
    return null;
  }
};

export const validateToken = (uuid: string, providedToken: string): boolean => {
  const storedToken = getStoredToken(uuid);
  return storedToken === providedToken;
};

export const clearToken = (): void => {
  Cookies.remove(COOKIE_NAME, { path: '/' });
};

export const cleanupExpiredTokens = (): void => {
  try {
    const cookieValue = Cookies.get(COOKIE_NAME);
    if (!cookieValue) return;

    const tokenData = JSON.parse(cookieValue);
    const oneDay = 24 * 60 * 60 * 1000;
    const isExpired = Date.now() - tokenData.createdAt > oneDay;

    if (isExpired) {
      clearToken();
    }
  } catch (error) {
    console.error('Error during token cleanup:', error);
    clearToken();
  }
};