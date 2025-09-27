import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { validatePageToken, getPageByToken } from '../firebase/services';

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

export const validateTokenWithServer = async (uuid: string, providedToken: string): Promise<boolean> => {
  try {
    // First check local cookie for quick validation
    const localValidation = validateToken(uuid, providedToken);
    if (!localValidation) {
      return false;
    }

    // Then validate with server for authoritative check
    return await validatePageToken(uuid, providedToken);
  } catch (error) {
    console.error('Error validating token with server:', error);
    return false;
  }
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

export const getPageWithTokenValidation = async (uuid: string, token: string) => {
  try {
    return await getPageByToken(uuid, token);
  } catch (error) {
    console.error('Error getting page with token validation:', error);
    return null;
  }
};

export const getExistingValidToken = (): { uuid: string; token: string } | null => {
  try {
    const cookieValue = Cookies.get(COOKIE_NAME);
    if (!cookieValue) return null;

    const tokenData = JSON.parse(cookieValue);
    const oneDay = 24 * 60 * 60 * 1000;
    const isExpired = Date.now() - tokenData.createdAt > oneDay;

    if (isExpired) {
      clearToken();
      return null;
    }

    return {
      uuid: tokenData.uuid,
      token: tokenData.token
    };
  } catch (error) {
    console.error('Error getting existing token:', error);
    clearToken();
    return null;
  }
};

export const hasValidTokenForAnyPage = async (): Promise<{ uuid: string; token: string } | null> => {
  const existingToken = getExistingValidToken();
  if (!existingToken) {
    return null;
  }

  // Validate with server to ensure token is still valid
  try {
    const isValid = await validatePageToken(existingToken.uuid, existingToken.token);
    if (isValid) {
      return existingToken;
    } else {
      // Server says token is invalid, clear it
      clearToken();
      return null;
    }
  } catch (error) {
    console.error('Error validating existing token with server:', error);
    return existingToken; // Return local token if server check fails
  }
};