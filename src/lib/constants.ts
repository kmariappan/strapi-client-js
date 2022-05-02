export const STORAGE_KEY = 'strapi.auth.token';

const AuthUrl = {
  signIn: '/auth/local',
  signUp: '/auth/local/register',
  getMe: '/users/me',
};

export const EndPoint = {
  auth: AuthUrl,
};
