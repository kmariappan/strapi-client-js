import { StrapiApiError } from './base';

export type AuthenticationResponse = {
  data: AuthData | null;
  error?: StrapiApiError;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  username: string;
  email: string;
  password: string;
};

export type Provider =
  | 'auth0'
  | 'cas'
  | 'cognito'
  | 'discord'
  | 'email'
  | 'facebook'
  | 'github'
  | 'google'
  | 'instagram'
  | 'linkedin'
  | 'microsoft'
  | 'reddit'
  | 'twitch'
  | 'twitter'
  | 'vk';

export type User = {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthData = {
  jwt: 'string';
  user: User | null;
  provider?: Provider;
};

export interface Session {
  access_token: string;
  user: User | null;
  /**
   * The number of seconds until the token expires (since it was issued). Returned when a login is confirmed.
   */
  expires_in?: number;
  /**
   * A timestamp of when the token will expire. Returned when a login is confirmed.
   */
  expires_at?: number;
  refresh_token?: string;
}
