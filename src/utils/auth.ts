import { v4 as uuidv4 } from 'uuid';

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