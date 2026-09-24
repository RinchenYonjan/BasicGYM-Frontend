let authToken: string | null = null;

export const getToken = (): string | null => {
  return authToken;
};

export const setToken = (token: string): void => {
  authToken = token;
};

export const removeToken = (): void => {
  authToken = null;
};
