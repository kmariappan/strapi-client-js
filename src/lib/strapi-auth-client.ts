import { AxiosInstance } from 'axios';
import { StrapiApiError, StrapiApiResponse, StrapiClientOptions, SupportedStorage } from './types/base';

import { AuthData, Session, SignInCredentials, SignUpCredentials, User } from './types/auth';

import { EndPoint, STORAGE_KEY } from './constants';
import { polyfillGlobalThis } from './helpers/polyfills';
import { isBrowser } from './helpers';
import { StrapiClientHelper } from './strapi-client-helper';

polyfillGlobalThis(); // Make "globalThis" available

const DEFAULT_OPTIONS = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
};

export class StrapiAuthClient extends StrapiClientHelper<AuthData> {
  private httpClient: AxiosInstance;

  protected localStorage: SupportedStorage;
  protected autoRefreshToken: boolean;
  protected persistSession: boolean;

  /**
   * The currently logged in user or null.
   */
  protected currentUser: User | null;
  /**
   * The session object for the currently logged in user or null.
   */
  protected currentSession: Session | null;

  constructor(axiosInstance: AxiosInstance, options: StrapiClientOptions) {
    const settings = { ...DEFAULT_OPTIONS, ...options };
    super(settings.url);
    this.httpClient = axiosInstance;
    this.currentUser = null;
    this.currentSession = null;
    this.autoRefreshToken = settings.autoRefreshToken;
    this.persistSession = settings.persistSession;
    this.localStorage = settings.localStorage || globalThis.localStorage;
  }

  /**
   *
   * @param credentials email and password
   * @returns data and error objects, data object contains jwt, user and provider
   */
  public signIn(credentials: SignInCredentials): Promise<StrapiApiResponse<AuthData>> {
    return new Promise<StrapiApiResponse<AuthData>>((resolve) => {
      this.httpClient
        .post<AuthData>(EndPoint.auth.signIn, {
          identifier: credentials.email,
          password: credentials.password,
        })
        .then((res) => {
          this._saveSession({
            access_token: res.data.jwt,
            user: res.data.user,
          });
          resolve({
            data: res.data,
          });
        })
        .catch((err) => {
          if (err) {
            return resolve(this._returnErrorHandler(err));
          }
        });
    });
  }

  /**
   *
   * @param credentials object contains username, email and password
   * @returns data and error objects, data object contains jwt, user and provider
   */

  public async signUp(credentials: SignUpCredentials): Promise<StrapiApiResponse<AuthData>> {
    return new Promise<StrapiApiResponse<AuthData>>((resolve) => {
      this.httpClient
        .post<AuthData>(EndPoint.auth.signUp, credentials)
        .then((res) => {
          resolve({ data: res.data });
          this._saveSession({
            access_token: res.data.jwt,
            user: res.data.user,
          });
        })
        .catch((err) => {
          if (err) {
            if (err) {
              return resolve(this._returnErrorHandler(err));
            }
          }
        });
    });
  }

  /**
   *
   * @returns Get the user object by JWT token
   */
  public async getMe(): Promise<StrapiApiResponse<User>> {
    return new Promise<StrapiApiResponse<User>>((resolve) => {
      this.httpClient
        .get<User>(EndPoint.auth.getMe)
        .then((res) => {
          resolve({ data: res.data });
        })
        .catch((err: any) => {
          if (err) {
            const error = err.response.data.error as StrapiApiError;
            return resolve({
              data: null,
              error,
            });
          }
        });
    });
  }

  /**
   * Inside a browser context, `signOut()` will remove the logged in user from the browser session
   * and log them out - removing all items from localstorage and then trigger a "SIGNED_OUT" event.
   *
   * For server-side management, you can disable sessions by passing a JWT through to `auth.api.signOut(JWT: string)`
   */
  async signOut(): Promise<{ error: StrapiApiError | null }> {
    const accessToken = this.currentSession?.access_token;
    this._removeSession();
    if (accessToken) {
      // const { error } = await this.api.signOut(accessToken);
      //  if (error) return { error };
    }
    return { error: null };
  }

  /**
   * set currentSession and currentUser
   * process to _startAutoRefreshToken if possible
   */
  private _saveSession(session: Session) {
    this.currentSession = session;
    this.currentUser = session.user;
    if (this.persistSession) {
      this._persistSession(this.currentSession);
    }
  }

  private async _removeSession() {
    this.currentSession = null;
    this.currentUser = null;
    //  if (this.refreshTokenTimer) clearTimeout(this.refreshTokenTimer)
    isBrowser() && (await this.localStorage.removeItem(STORAGE_KEY));
  }

  private _persistSession(currentSession: Session) {
    const data = { currentSession, expiresAt: currentSession.expires_at };
    isBrowser() && this.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}
